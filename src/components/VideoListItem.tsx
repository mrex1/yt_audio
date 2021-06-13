import React, { useCallback } from 'react'
import {Video} from '../types'
import {IconButton} from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import './VideoListItem.css'

interface Props {
    video: Video;
    setVideo: (video: Video) => void;
}

const VideoListItem = ({ video, setVideo }: Props) => {
    const { title, id } = video
    const thumbnail = video.thumbnail.url
    const onVidClick = useCallback(() => {
        setVideo(video)
    }, [video, setVideo])
    return (
        <div className='video-list-item-container'>
            <img
                src={thumbnail}
                alt='thumbnail'
                loading='lazy'
            />
            <div className='content'>
            <div className='title'>
                {title}
            </div>
            <div className="subtitle">
                {id}
            </div>
            </div>
            <IconButton onClick={onVidClick} color='secondary'>
                <PlayCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default VideoListItem