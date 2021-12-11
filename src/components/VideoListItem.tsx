import React, { useCallback, useContext } from 'react'
import { Video } from '../types'
import { isSuggestVideo, isSearchVideo, formatViews } from '../utils'
import { api } from '../services'
import { IconButton } from '@material-ui/core'
import { mainScreenVideoContext } from '../context'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DownloadIcon from '@material-ui/icons/GetApp'
import Thumbnail from './Thumbnail'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import clsx from 'clsx'
import './VideoListItem.css'

interface Props {
    video: Video;
    playing?: boolean;
    onAddClick?: (vid: string) => void;
    onPlayClick?: (vid: string) => void;
    onDownloadClick?: (vid: string) => void;
}

const VideoListItem = ({ video, playing, onAddClick, onPlayClick, onDownloadClick }: Props) => {
    const {title, author} = video
    const thumbnail = isSuggestVideo(video) ? video.thumbnail.url : video.bestThumbnail.url
    const views = isSearchVideo(video) ? video.views : null
    const {setVideosWithLoading} = useContext(mainScreenVideoContext)

    const onAddClickHandler = useCallback(() => {
        if (onAddClick) {
            onAddClick(video.id)
        }
    }, [video, onAddClick])

    const onDownloadClickHandler = useCallback(() => {
        if (onDownloadClick) {
            onDownloadClick(video.id)
        }
    }, [video, onDownloadClick])

    const onPlayClickHandler = useCallback(() => {
        if (onPlayClick) {
            onPlayClick(video.id)
        }
    }, [video, onPlayClick])

    const getChannelLoader = useCallback((channelID: string) => async () => {
        const result = await api.getYTPlaylist(channelID)
        const videos = result ? result.items : []
        const continuation = result?.continuation
        const channel = result?.author
        return {videos, continuation, channel}
    }, [])

    const setChannel = useCallback(() => {
        if (video.author) {
            setVideosWithLoading(getChannelLoader(video.author.channelID))
        }
    }, [setVideosWithLoading, getChannelLoader, video])

    return (
        <div className={clsx('video-list-item-container', {playing})}>
            {thumbnail && <Thumbnail thumbnailUrl={thumbnail} duration={video.duration}/>}
            <div className='video-list-item-content'>
                <div className='video-list-item-title single-line'>
                    {title}
                </div>
                <div className='video-list-item-subtitle single-line' onClick={setChannel}>
                    {author?.name}
                </div>
                <div className='video-list-item-subtitle single-line' onClick={setChannel}>
                    {formatViews(views)}
                </div>
                <div className='video-list-item-row tools'>
                    {!playing && onPlayClick && <IconButton onClick={onPlayClickHandler} color='secondary'>
                        <PlayCircleOutlineIcon/>
                    </IconButton>}
                    {onAddClick && <IconButton onClick={onAddClickHandler} color='secondary'>
                        <AddCircleOutlineIcon/>
                    </IconButton>}
                    {onDownloadClick && <IconButton onClick={onDownloadClickHandler} color='secondary'>
                        <DownloadIcon/>
                    </IconButton>}
                </div>
            </div>
        </div>
    )
}

export default VideoListItem