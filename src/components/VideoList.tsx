import React from 'react'
import VideoListItem from './VideoListItem'
import {Video} from '../types'

interface Props{
    videos: Array<Video>;
    setVideo: (video: string) => void;
    className?: string;
    spaceBottom?: boolean;
}

const VideoList = ({videos, setVideo, className, spaceBottom}: Props) => {
    return (<div className={className} style={{height: '100%', overflow: 'auto'}}>
        {videos && videos.map(v => <VideoListItem video={v} key={v.videoId} setVideo={setVideo}/>)}
        {spaceBottom && <div style={{height: 150}}/>}
        </div>)
}

export default VideoList