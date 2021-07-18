import { useState, useCallback } from "react"
import { Continuation as SearchContinuation} from 'ytsr'
import { Continuation as YTPlaylistContinuation } from 'ytpl'
import { ChannelInfo, Video, VideoLoader } from '../types'
import { api } from '../services'

export function useVideos() {
	const [channel, setChannel] = useState<ChannelInfo | undefined>()
	const [videos, setVideos] = useState<Array<Video>>([])
	const [continuation, setContinuation] = useState<SearchContinuation | YTPlaylistContinuation | undefined | null>()
	const [loading, setLoading] = useState<boolean>(false)
	const setVideosWithLoading = useCallback(async (loadVideos: VideoLoader) => {
		if (!loading) {
			setLoading(true)
			try {
				const {videos, continuation, channel} = await loadVideos()
				setVideos(videos)
				setContinuation(continuation)
				setChannel(channel)
			} catch (err) {
				console.log(err)
			}
			setLoading(false)
		}
	}, [loading])
	const loadMoreSearchResults = useCallback(async (continuation: SearchContinuation) => {
		const result = await api.searchContinue(continuation)
		if (result) {
			const newVideos = result.items.filter(i => i.type === 'video') as Video[]
			return {newVideos, newContinuation: result.continuation}
		}
	}, [])
	const loadMoreYTPlaylistVideos = useCallback(async (continuation: YTPlaylistContinuation) => {
		const result = await api.getYTplaylistByContinuation(continuation)
		if (result) {
			const newVideos = result.items as Video[]
			return {newVideos, newContinuation: result.continuation}
		}
	}, [])
	const loadMoreVideos = useCallback(async () => {
		if (!continuation) return
		const loader = channel ? loadMoreYTPlaylistVideos : loadMoreSearchResults
		const result = await loader(continuation)
		if (result) {
			setVideos(videos.concat(result.newVideos))
			setContinuation(result.newContinuation)
		}
		
	}, [continuation, videos, channel, loadMoreSearchResults, loadMoreYTPlaylistVideos])

	return {videos, channel, loading, setVideosWithLoading, loadMoreVideos}
}