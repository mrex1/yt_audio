import './App.css';
import { useState, useCallback } from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import PlaylistRenderer from './components/PlaylistRenderer'
import { theme } from './constants'
import { api, playlist } from './services'
import { LinearProgress, ThemeProvider } from '@material-ui/core'
import {Video, Continuation} from 'ytsr'
import { useEffect } from 'react';
import { SuggestVideo } from './types';
import { videoContext, autoplayContext, videoListenerContext, playlistActionContext } from './context'


function App() {
	const [videos, setVideos] = useState<Array<Video>>([])
	const [end, setEnd] = useState<boolean>(true)
	const [autoplay, setAutoplay] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)
	const [playlistVideos, setPlaylistVideos] = useState<Array<Video | SuggestVideo>>([])
	const [continuation, setContinuation] = useState<Continuation | null>(null)
	const [current, setCurrent] = useState<number | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const onSearchTermChange = useCallback((evt) => {
		const txt = evt.target.value
		setSearchTerm(txt)
	}, [])

	const onSearch = useCallback(async () => {
		setLoading(true)
		try {
			const result = await api.search(searchTerm)
			if (result) {
				setVideos(result.items.filter(i => i.type === 'video') as Video[])
				setContinuation(result.continuation)
			} else {
				setVideos([])
			}
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
	}, [searchTerm])

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

	const loadMoreSearchResult = useCallback(async () => {
		if (continuation === null) return
		const result = await api.searchContinue(continuation)
		if (result) {
			const newVideos = result.items.filter(i => i.type === 'video') as Video[]
			setVideos(videos.concat(newVideos))
			setContinuation(result.continuation)
		}
	}, [continuation, videos])
	return (
		<playlistActionContext.Provider value={{addToPlaylist, playVideo}}>
		<videoListenerContext.Provider value={{onVideoEnd, onVideoStart}}>
		<videoContext.Provider value={{videos}}>
		<autoplayContext.Provider value={{autoplay, setAutoplay}}>
		<ThemeProvider theme={theme}>
			<div className='background'>
				<SearchBar onChange={onSearchTermChange} onSubmit={onSearch} />
				{loading ?
					<LinearProgress /> :
					<VideoList
						className={'video-list'}
						spaceBottom
						loadVideos={loadMoreSearchResult}/>}
				{current !== null && <PlaylistRenderer
					playlistVideos={playlistVideos}
					currentIndex={current}/>}
			</div>
		</ThemeProvider>
		</autoplayContext.Provider>
		</videoContext.Provider>
		</videoListenerContext.Provider>
		</playlistActionContext.Provider>
	);
}

export default App;
