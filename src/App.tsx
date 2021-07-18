import './App.css';
import { useState, useCallback, useEffect } from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import PlaylistRenderer from './components/PlaylistRenderer'
import { theme } from './constants'
import { api, playlist } from './services'
import { LinearProgress, ThemeProvider } from '@material-ui/core'
import { Video } from './types';
import { mainScreenVideoContext, autoplayContext, videoListenerContext, playlistActionContext } from './context'
import ChannelHeader from './components/ChannelHeader'
import { useVideos } from './hooks'

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
				{loading ?
					<LinearProgress /> :
					<VideoList
						className={'video-list'}
						spaceBottom
						videos={videos}
						loadVideos={loadMoreVideos}>
							{channel && <ChannelHeader channelInfo={channel}/>}
					</VideoList>}
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
