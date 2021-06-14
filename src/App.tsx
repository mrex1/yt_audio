import './App.css';
import { useState, useCallback } from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import PlaylistRenderer from './components/PlaylistRenderer'
import { theme } from './constants'
import { api, playlist } from './services'
import { LinearProgress, ThemeProvider } from '@material-ui/core'
import { Video, VideoInfo } from './types';
import { useEffect } from 'react';

function App() {
	const [videos, setVideos] = useState<Array<Video>>([])
	const [end, setEnd] = useState<boolean>(true)
	const [loading, setLoading] = useState<boolean>(false)
	const [playlistVideos, setPlaylistVideos] = useState<Array<VideoInfo>>([])
	const [current, setCurrent] = useState<number | null>(null)
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
				setVideos(result)
				setLoading(false)
			} catch (err) {
				console.log(err)
			}
		}
		fetchData()
	}, [searchTerm])

	const setVideo = useCallback((videoId: string) => {
		playlist.add(videoId).then(() => setPlaylistVideos(playlist.playlistVideos))
		if (end) {
			const next = playlist.next()
			if (next !== undefined) {
				setCurrent(next)
			}
		}
	}, [end])

	useEffect(() => {
		if (end) {
			const next = playlist.next()
			if (next) {
				setCurrent(next)
			}
		}
	}, [end])

	const onVideoEnd = useCallback(() => {
		setEnd(true)
	}, [])

	const onVideoStart = useCallback(() => {
		setEnd(false)
	}, [])
	return (
		<ThemeProvider theme={theme}>
			<div className='background' style={{ height: '100vh', overflow: 'hidden' }}>
				<SearchBar onChange={onSearchTermChange} onSubmit={onSearch} />
				{loading ? <LinearProgress /> : <VideoList spaceBottom videos={videos} setVideo={setVideo} />}
				<PlaylistRenderer playlistVideos={playlistVideos} currentIndex={current} onVideoEnd={onVideoEnd} onVideoStart={onVideoStart}/>
			</div>
		</ThemeProvider>
	);
}

export default App;
