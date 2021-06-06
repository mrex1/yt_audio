import React from 'react'
import VideoListItem from './VideoListItem'

interface Props{
    videos: Array<any>;
    setVideo: (video: any) => void;
}

const VideoList = ({videos, setVideo}: Props) => {
    return (<div style={{height: '100%', overflow: 'auto'}}>
        {videos && videos.map(v => <VideoListItem video={v} key={v.url} setVideo={setVideo}/>)}
        <div style={{height: 200}}/>
        </div>)
}

export default VideoList