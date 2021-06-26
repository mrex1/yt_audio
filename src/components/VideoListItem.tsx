import React, { useCallback } from 'react'
import {Video} from 'ytsr'
import {IconButton} from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import './VideoListItem.css'

interface Props {
    video: Video;
    setVideo: (videoId: string) => void;
}

const VideoListItem = ({ video, setVideo }: Props) => {
    const { title, id } = video
    const thumbnail = video.bestThumbnail.url
    const onVidClick = useCallback(() => {
        setVideo(video.id)
    }, [video, setVideo])
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
            <div className="subtitle">
                {id}
            </div>
            </div>
            <IconButton onClick={onVidClick} color='secondary'>
                <AddCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default VideoListItem