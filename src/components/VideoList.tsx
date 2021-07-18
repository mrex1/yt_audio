import React, { useCallback, useState, useContext } from 'react'
import VideoListItem from './VideoListItem'
import { LinearProgress } from '@material-ui/core'
import { api } from '../services'
import { openLink } from '../utils'
import { playlistActionContext } from '../context'
import { Video } from '../types'

interface Props{
    loadVideos?: () => Promise<void>;
    className?: string;
    spaceBottom?: boolean;
    videos: Array<Video>;
    children?: JSX.Element;
}

const VideoList = ({className, spaceBottom, loadVideos, videos, children}: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const {addToPlaylist, addToPlaylistThenPlay} = useContext(playlistActionContext)
    const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback((e) => {
        const d = e.currentTarget
        if (loadVideos && !loading && d.scrollHeight - d.offsetHeight - d.scrollTop < 2) {
            setLoading(true)
            loadVideos().then(() => setLoading(false))
        }
    }, [loadVideos, loading])

    const onAddClick = useCallback((videoId: string) => {
        addToPlaylist(videoId)
    }, [addToPlaylist])

    const onLaunchClick = useCallback((videoId: string) => {
        const youtubeLink = api.getYoutubeLink(videoId)
        openLink(youtubeLink)
    }, [])

    const onPlayClick = useCallback((videoId: string) => {
        addToPlaylistThenPlay(videoId)
    }, [addToPlaylistThenPlay])
    
    return (
    <div 
    className={className}
    onScroll={onScroll}>
        {children}
        {videos.map(v =>
            <VideoListItem
                video={v}
                key={v.id}
                onAddClick={onAddClick}
                onPlayClick={onPlayClick}
                onLaunchClick={onLaunchClick}/>)}
        {loading && <LinearProgress/>}
        {spaceBottom && <div style={{height: 100}}/>}
    </div>
    )
}

export default VideoList