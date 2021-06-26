import React, { useCallback, useState } from 'react'
import VideoListItem from './VideoListItem'
import {Video} from 'ytsr'
import { LinearProgress } from '@material-ui/core'

interface Props{
    videos: Array<Video>;
    setVideo: (video: string) => void;
    loadVideos: () => Promise<void>;
    className?: string;
    spaceBottom?: boolean;
}

const VideoList = ({videos, setVideo, className, spaceBottom, loadVideos}: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
        const d = e.currentTarget
        if (!loading && d.scrollHeight - d.offsetHeight - d.scrollTop < 2) {
            setLoading(true)
            loadVideos().then(() => setLoading(false))
        }
    }, [loadVideos, loading])
    
    return (
    <div 
    className={className}
    onScroll={onScroll}>
        {videos.map(v => <VideoListItem video={v} key={v.id} setVideo={setVideo}/>)}
        {loading && <LinearProgress/>}
        {spaceBottom && <div style={{height: 100}}/>}
    </div>
    )
}

export default VideoList