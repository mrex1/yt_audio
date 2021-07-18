import './App.css';
import { useState, useCallback, useEffect } from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import PlaylistRenderer from './components/PlaylistRenderer'
import { theme } from './constants'
import { api, playlist } from './services'
import { LinearProgress, ThemeProvider, Typography } from '@material-ui/core'
import { Continuation as SearchContinuation} from 'ytsr'
import { Continuation as YTPlaylistContinuation } from 'ytpl'
import { Video, VideoLoader } from './types';
import { mainScreenVideoContext, autoplayContext, videoListenerContext, playlistActionContext } from './context'

function useVideos() {
	const [channel, setChannel] = useState<string | undefined>()
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

function App() {
	const [end, setEnd] = useState<boolean>(true)
	const [autoplay, setAutoplay] = useState<boolean>(true)
	const [playlistVideos, setPlaylistVideos] = useState<Array<Video>>([])
	const [current, setCurrent] = useState<number | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const {videos, channel, loading, setVideosWithLoading, loadMoreVideos} = useVideos()

	const onSearchTermChange = useCallback((evt) => {
		const txt = evt.target.value
		setSearchTerm(txt)
	}, [])

	const searchVideos = useCallback(async () => {
		const result = await api.search(searchTerm)
		const videos = result?.items.filter(i => i.type === 'video') as Video[]
		const continuation = result?.continuation
		return {videos, continuation}
	}, [searchTerm])

	const onSearch = useCallback(async () => {
		setVideosWithLoading(searchVideos)
	}, [setVideosWithLoading, searchVideos])

	const addToPlaylist = useCallback((videoId: string) => {
		playlist.add(videoId)
		setPlaylistVideos(playlist.playlistVideos)
	}, [])

	const addSuggestionToPlaylist = useCallback(async () => {
		const suggestion = await playlist.suggest()
		if (suggestion) {
			addToPlaylist(suggestion)
		}
	}, [addToPlaylist])

	useEffect(() => {
		//for autoplaying next video
		if (end && autoplay && playlistVideos.length > 0) {
			const next = playlist.next()
			if (next === undefined) {
				addSuggestionToPlaylist()
			} else {
				setCurrent(next)
			}
		}
	}, [end, autoplay, playlistVideos, addSuggestionToPlaylist])

	const onVideoEnd = useCallback(() => {
		setEnd(true)
	}, [])

	const onVideoStart = useCallback(() => {
		setEnd(false)
	}, [])

	const playVideo = useCallback((id: number) => {
		playlist.current = id
		setCurrent(id)
	}, [])

	const addToPlaylistThenPlay = useCallback((videoId: string) => {
		addToPlaylist(videoId)
		playlist.setCurByVid(videoId)
		setCurrent(playlist.current)
		setEnd(false)
	}, [addToPlaylist])
	
	return (
		<mainScreenVideoContext.Provider value={{setVideosWithLoading}}>
		<playlistActionContext.Provider value={{addToPlaylist, playVideo, addToPlaylistThenPlay}}>
		<videoListenerContext.Provider value={{onVideoEnd, onVideoStart}}>
		<autoplayContext.Provider value={{autoplay, setAutoplay}}>
		<ThemeProvider theme={theme}>
			<div className='background'>
				<SearchBar onChange={onSearchTermChange} onSubmit={onSearch} />
				{channel && <Typography variant='h3' component='h3' color='secondary'>{channel}</Typography>}
				{loading ?
					<LinearProgress /> :
					<VideoList
						className={'video-list'}
						spaceBottom
						videos={videos}
						loadVideos={loadMoreVideos}/>}
				{current !== null && <PlaylistRenderer
					playlistVideos={playlistVideos}
					currentIndex={current}/>}
			</div>
		</ThemeProvider>
		</autoplayContext.Provider>
		</videoListenerContext.Provider>
		</playlistActionContext.Provider>
		</mainScreenVideoContext.Provider>
	);
}

export default App;
