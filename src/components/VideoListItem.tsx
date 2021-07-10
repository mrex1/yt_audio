import React, { useCallback, useContext } from 'react'
import {Video} from 'ytsr'
import {SuggestVideo} from '../types'
import { isSuggestVideo } from '../utils'
import {IconButton} from '@material-ui/core'
import {api} from '../services'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import {playlistActionContext} from '../context'
import './VideoListItem.css'

interface Props {
    video: Video | SuggestVideo;
}

const VideoListItem = ({ video }: Props) => {
    const {title, id} = video
    const thumbnail = isSuggestVideo(video) ? video.thumbnail.url : video.bestThumbnail.url
    const {addToPlaylist} = useContext(playlistActionContext)
    const onVidClick = useCallback(() => {
        addToPlaylist(video.id)
    }, [video, addToPlaylist])
    return (
        <div className='video-list-item-container'>
            {thumbnail && <img
                src={thumbnail}
                alt='thumbnail'
                loading='lazy'
            />}
            <div className='content'>
            <div className='title'>
                {title}
            </div>
            <a className="subtitle" href={api.getYoutubeLink(id)} target='_blank' rel='noreferrer'>
                Open in YouTube
            </a>
            </div>
            <IconButton onClick={onVidClick} color='secondary'>
                <AddCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default VideoListItem