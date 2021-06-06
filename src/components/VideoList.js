import React from 'react'
import VideoListItem from './VideoListItem'

const VideoList = ({videos, setVideo}) => {
    return (<div style={{height: '100%', overflow: 'auto'}}>
        {videos && videos.map(v => <VideoListItem video={v} key={v.url} setVideo={setVideo}/>)}
        <div style={{height: 200}}/>
        </div>)
}

export default VideoList