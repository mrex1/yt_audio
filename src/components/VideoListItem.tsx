import React, { useCallback, useContext } from 'react'
import {Video} from 'ytsr'
import {SuggestVideo} from '../types'
import { isSuggestVideo } from '../utils'
import {IconButton} from '@material-ui/core'
import {api} from '../services'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import LaunchIcon from '@material-ui/icons/Launch'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import {playlistActionContext} from '../context'
import './VideoListItem.css'

interface Props {
    video: Video | SuggestVideo;
}

const VideoListItem = ({ video }: Props) => {
    const {title, author} = video
    const thumbnail = isSuggestVideo(video) ? video.thumbnail.url : video.bestThumbnail.url
    const {addToPlaylist} = useContext(playlistActionContext)

    const onVidClick = useCallback(() => {
        addToPlaylist(video.id)
    }, [video, addToPlaylist])

    const onLaunchClick = useCallback(() => {
        const a = document.createElement('a')
        a.href = api.getYoutubeLink(video.id)
        a.target = '_blank'
        a.rel = 'no-referrer'
        a.click()
    }, [video])

    const onPlayClick = useCallback(() => {

    }, [])
    return (
        <div className='video-list-item-container'>
            <div className='video-list-item-row'>
                {thumbnail && <img
                    src={thumbnail}
                    className='thumbnail'
                    alt='thumbnail'
                    loading='lazy'
                />}
                <div className='content'>
                    <div className='title single-line'>
                        {title}
                    </div>
                    <div className='video-list-item-row subtitle'>
                        <span className='single-line'>{author?.name}</span>
                    </div>
                    <div className='video-list-item-row tools'>
                        <IconButton onClick={onPlayClick} color='secondary'>
                            <PlayCircleOutlineIcon/>
                        </IconButton>
                        <IconButton onClick={onVidClick} color='secondary'>
                            <AddCircleOutlineIcon/>
                        </IconButton>
                        <IconButton onClick={onLaunchClick} color='secondary'>
                            <LaunchIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoListItem