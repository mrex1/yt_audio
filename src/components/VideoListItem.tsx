import React, { useCallback } from 'react'
import {Video} from '../types'
import {IconButton} from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import './VideoListItem.css'

interface Props {
    video: Video;
    setVideo: (videoId: string) => void;
}

const VideoListItem = ({ video, setVideo }: Props) => {
    const { title, videoId } = video
    const thumbnail = video.thumbnailUrl
    const onVidClick = useCallback(() => {
        setVideo(video.videoId)
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
                {videoId}
            </div>
            </div>
            <IconButton onClick={onVidClick} color='secondary'>
                <AddCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default VideoListItem