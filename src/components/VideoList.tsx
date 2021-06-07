import React from 'react'
import VideoListItem from './VideoListItem'
import {Video} from '../types'

interface Props{
    videos: Array<Video>;
    setVideo: (video: Video) => void;
}

const VideoList = ({videos, setVideo}: Props) => {
    return (<div style={{height: '100%', overflow: 'auto'}}>
        {videos && videos.map(v => <VideoListItem video={v} key={v.id} setVideo={setVideo}/>)}
        <div style={{height: 200}}/>
        </div>)
}

export default VideoList