import React, { useCallback, useState, useContext } from 'react'
import VideoListItem from './VideoListItem'
import { LinearProgress } from '@material-ui/core'
import { playlistActionContext, videoContext } from '../context'

interface Props{
    loadVideos?: () => Promise<void>;
    className?: string;
    spaceBottom?: boolean;
}

const VideoList = ({className, spaceBottom, loadVideos}: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const {videos} = useContext(videoContext)
    const {addToPlaylist} = useContext(playlistActionContext)
    const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
        const d = e.currentTarget
        if (loadVideos && !loading && d.scrollHeight - d.offsetHeight - d.scrollTop < 2) {
            setLoading(true)
            loadVideos().then(() => setLoading(false))
        }
    }, [loadVideos, loading])
    
    return (
    <div 
    className={className}
    onScroll={onScroll}>
        {videos.map(v => <VideoListItem video={v} key={v.id} setVideo={addToPlaylist}/>)}
        {loading && <LinearProgress/>}
        {spaceBottom && <div style={{height: 100}}/>}
    </div>
    )
}

export default VideoList