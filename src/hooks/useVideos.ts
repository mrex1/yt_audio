import { useState, useCallback, useEffect } from "react"
import { Continuation as SearchContinuation} from 'ytsr'
import { Continuation as YTPlaylistContinuation } from 'ytpl'
import { ChannelInfo, Video, VideoLoader } from '../types'
import { api } from '../services'
import { sleep } from '../utils'

const NUMBER_OF_VIDEO_TO_LOAD = 15

export function useVideos() {
	const [channel, setChannel] = useState<ChannelInfo | undefined>()
	const [videos, setVideos] = useState<Array<Video>>([])
    const [displayVideos, setDisplayVideos] = useState<Array<Video>>([])
	const [count, setCount] = useState<number>(NUMBER_OF_VIDEO_TO_LOAD)
    const [continuation, setContinuation] = useState<SearchContinuation | YTPlaylistContinuation | undefined | null>()
	const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setDisplayVideos(videos.slice(0, count))
    }, [videos, count])
	const setVideosWithLoading = useCallback(async (loadVideos: VideoLoader) => {
		if (!loading) {
			setLoading(true)
			try {
				const {videos, continuation, channel} = await loadVideos()
				setVideos(videos)
				setContinuation(continuation)
				setChannel(channel)
                setCount(NUMBER_OF_VIDEO_TO_LOAD)
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
        if (videos.length - count >= NUMBER_OF_VIDEO_TO_LOAD) {
            await sleep(500)
            return setCount(count + NUMBER_OF_VIDEO_TO_LOAD)
        }
		if (!continuation) {
            if (videos.length > count) return setCount(count + NUMBER_OF_VIDEO_TO_LOAD)
            return
        }
		const loader = channel ? loadMoreYTPlaylistVideos : loadMoreSearchResults
		const result = await loader(continuation)
		if (result) {
			const newVideos = videos.concat(result.newVideos)
            if (videos.length > count)  setCount(count + NUMBER_OF_VIDEO_TO_LOAD)
            setVideos(newVideos)
			setContinuation(result.newContinuation)
		}
		
	}, [continuation, videos, channel, count, loadMoreSearchResults, loadMoreYTPlaylistVideos])

	return {videos: displayVideos, channel, loading, setVideosWithLoading, loadMoreVideos}
}