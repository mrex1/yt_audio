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

function App() {
	const [videos, setVideos] = useState<Array<Video>>([])
	const [end, setEnd] = useState<boolean>(true)
	const [autoplay, setAutoplay] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)
	const [playlistVideos, setPlaylistVideos] = useState<Array<Video | SuggestVideo>>([])
	const [continuation, setContinuation] = useState<Continuation | null>(null)
	const [current, setCurrent] = useState<number>(-1)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const onSearchTermChange = useCallback((evt) => {
		const txt = evt.target.value
		setSearchTerm(txt)
	}, [])

	const onSearch = useCallback(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const result = await api.search(searchTerm)
				if (result) {
					setVideos(result.items.filter(i => i.type === 'video') as Video[])
					setContinuation(result.continuation)
				} else {
					setVideos([])
				}
				setLoading(false)
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()
	}, [searchTerm])

	const setVideo = useCallback((videoId: string) => {
		playlist.add(videoId)
		setPlaylistVideos(playlist.playlistVideos)
		if (end && autoplay) {
			setEnd(false)
			const next = playlist.setCurByVid(videoId)
			if (next !== undefined) {
				setCurrent(next)
			}
		}
	}, [end, autoplay])

	useEffect(() => {
		//for autoplaying next video
		if (end && autoplay && playlist.playlistVideos.length > 0) {
			playlist.next().then((next) => {
				if (next !== undefined) {
					setPlaylistVideos(playlist.playlistVideos)
					setCurrent(next)
				}
			})
		}
	}, [end, autoplay, setVideo])

	const onVideoEnd = useCallback(() => {
		setEnd(true)
	}, [])

	const onVideoStart = useCallback(() => {
		setEnd(false)
	}, [])

	const updateCurrent = useCallback((id: number) => {
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
		<ThemeProvider theme={theme}>
			<div className='background' style={{ height: '100vh', overflow: 'hidden' }}>
				<SearchBar onChange={onSearchTermChange} onSubmit={onSearch} />
				{loading ?
					<LinearProgress /> :
					<VideoList
						className={'video-list'}
						spaceBottom
						videos={videos}
						setVideo={setVideo}
						loadVideos={loadMoreSearchResult}/>}
				<PlaylistRenderer
				autoplay={autoplay}
				setAutoplay={setAutoplay}
				playVideo={updateCurrent} onAdd={setVideo} playlistVideos={playlistVideos} currentIndex={current} onVideoEnd={onVideoEnd} onVideoStart={onVideoStart}/>
			</div>
		</ThemeProvider>
	);
}

export default App;
