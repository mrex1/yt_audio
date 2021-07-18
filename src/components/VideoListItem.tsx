import React, { useCallback, useContext } from 'react'
import { Video } from '../types'
import { isSuggestVideo } from '../utils'
import { api } from '../services'
import { IconButton } from '@material-ui/core'
import { mainScreenVideoContext } from '../context'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import LaunchIcon from '@material-ui/icons/Launch'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import clsx from 'clsx'
import './VideoListItem.css'

interface Props {
    video: Video;
    playing?: boolean;
    onAddClick?: (vid: string) => void;
    onPlayClick?: (vid: string) => void;
    onLaunchClick?: (vid: string) => void;
}

const VideoListItem = ({ video, playing, onAddClick, onPlayClick, onLaunchClick }: Props) => {
    const {title, author} = video
    const thumbnail = isSuggestVideo(video) ? video.thumbnail.url : video.bestThumbnail.url
    const {setVideosWithLoading} = useContext(mainScreenVideoContext)

    const onAddClickHandler = useCallback(() => {
        if (onAddClick) {
            onAddClick(video.id)
        }
    }, [video, onAddClick])

    const onLaunchClickHandler = useCallback(() => {
        if (onLaunchClick) {
            onLaunchClick(video.id)
        }
    }, [video, onLaunchClick])

    const onPlayClickHandler = useCallback(() => {
        if (onPlayClick) {
            onPlayClick(video.id)
        }
    }, [video, onPlayClick])

    const getChannelLoader = useCallback((channelID: string) => async () => {
        const result = await api.getYTPlaylist(channelID)
        const videos = result ? result.items : []
        const continuation = result?.continuation
        const channel = result?.author.name
        return {videos, continuation, channel}
    }, [])

    const setChannel = useCallback(() => {
        if (video.author) {
            setVideosWithLoading(getChannelLoader(video.author.channelID))
        }
    }, [setVideosWithLoading, getChannelLoader, video])

    return (
        <div className={clsx('video-list-item-container', {playing})}>
            {thumbnail && <img
                src={thumbnail}
                className='video-list-item-thumbnail'
                alt='thumbnail'
                loading='lazy'
            />}
            <div className='video-list-item-content'>
                <div className='video-list-item-title single-line'>
                    {title}
                </div>
                <div className='video-list-item-subtitle single-line' onClick={setChannel}>
                    {author?.name}
                </div>
                <div className='video-list-item-row tools'>
                    {!playing && onPlayClick && <IconButton onClick={onPlayClickHandler} color='secondary'>
                        <PlayCircleOutlineIcon/>
                    </IconButton>}
                    {onAddClick && <IconButton onClick={onAddClickHandler} color='secondary'>
                        <AddCircleOutlineIcon/>
                    </IconButton>}
                    {onLaunchClick && <IconButton onClick={onLaunchClickHandler} color='secondary'>
                        <LaunchIcon/>
                    </IconButton>}
                </div>
            </div>
        </div>
    )
}

export default VideoListItem