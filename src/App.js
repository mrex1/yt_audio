import './App.css';
import {useState, useCallback} from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import Player from './components/Player'
import {URL, theme} from './constants'
import {LinearProgress, ThemeProvider} from '@material-ui/core'

function App() {
  const [videos, setVideos] = useState([])
  const [videoUrl, setVideoUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const onSearchTermChange = useCallback((evt) => {
    const txt = evt.target.value
    setSearchTerm(txt)
  }, [])

  const onSearch = useCallback(() => {
    const fetchData = async () => {
      try {
        const formatSearchTearm = searchTerm.split(' ').join('+')
        setLoading(true)
        const result = await fetch(`${URL}/search/` + formatSearchTearm).then(res => res.json())
        setVideos(result)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [searchTerm])

  const setVideo = useCallback(video => {
    const url = `${URL}/`+video.url.substr(12)
    setVideoUrl(url)
  }, [])
  return (
    <ThemeProvider theme={theme}>
    <div style={{height: '100vh', overflow: 'hidden'}}>
    <SearchBar onChange={onSearchTermChange} onSubmit={onSearch}/>
    {loading ? <LinearProgress /> : <VideoList videos={videos} setVideo={setVideo}/>}
    <Player src={videoUrl}/>
    </div>
    </ThemeProvider>
  );
}

export default App;
