import './App.css';
import {useState, useCallback} from 'react'
import VideoList from './components/VideoList'
import SearchBar from './components/SearchBar'
import Player from './components/Player'
import {URL} from './constants'

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
    console.log(url)
    setVideoUrl(url)
  }, [])
  return (
    <div>
    <SearchBar onChange={onSearchTermChange} onSubmit={onSearch}/>
    {loading ? <p>loading...</p> : <VideoList videos={videos} setVideo={setVideo}/>}
    <Player src={videoUrl}/>
    </div>
  );
}

export default App;
