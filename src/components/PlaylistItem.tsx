import React, { useCallback } from 'react'
import {VideoDetails} from '../types'
import {IconButton} from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import clsx from 'clsx'
import './PlaylistItem.css'

interface Props {
    video: VideoDetails;
    playing?: boolean;
    setVideo: (videoId: string) => void;
}

const PlaylistItem = ({ video, setVideo, playing }: Props) => {
    const { title, author, thumbnailUrl } = video
    const onVidClick = useCallback(() => {
        setVideo(video.videoId)
    }, [video, setVideo])
    return (
        <div className={clsx('play-list-item-container', {playing})}>
            <img
                src={thumbnailUrl}
                alt='thumbnail'
                loading='lazy'
            />
            <div className='content'>
            <div className='title'>
                {title}
            </div>
            <div className="subtitle">
                {author}
            </div>
            </div>
            <IconButton className={clsx('icon', {playing})} onClick={onVidClick} color='secondary'>
                <PlayCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default PlaylistItem