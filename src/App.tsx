import './App.css';
import {useState, useCallback} from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import Player from './components/Player'
import {theme} from './constants'
import {api} from './services'
import {LinearProgress, ThemeProvider} from '@material-ui/core'
import { Video } from './types';

function App() {
  const [videos, setVideos] = useState<Array<Video>>([])
  const [videoId, setVideoId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
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

  const setVideo = useCallback((video: Video) => {
    setVideoId(video.id)
  }, [])
  return (
    <ThemeProvider theme={theme}>
    <div style={{height: '100vh', overflow: 'hidden'}}>
    <SearchBar onChange={onSearchTermChange} onSubmit={onSearch}/>
    {loading ? <LinearProgress /> : <VideoList videos={videos} setVideo={setVideo}/>}
    <Player videoId={videoId}/>
    </div>
    </ThemeProvider>
  );
}

export default App;
