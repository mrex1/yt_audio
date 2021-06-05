import React from 'react'
import VideoListItem from './VideoListItem'

const VideoList = ({videos, setVideo}) => {
    return (<div>
        {videos && videos.map(v => <VideoListItem video={v} key={v.url} setVideo={setVideo}/>)}
        <div style={{height: 140}}/>
        </div>)
}

export default VideoList