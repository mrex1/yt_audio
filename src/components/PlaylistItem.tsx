import React, { useCallback } from 'react'
import {Video} from 'ytsr'
import {IconButton} from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import clsx from 'clsx'
import './PlaylistItem.css'

interface Props {
    video: Video;
    playing?: boolean;
    setVideo: (videoId: string) => void;
}

const PlaylistItem = ({ video, setVideo, playing }: Props) => {
    const { title, author } = video
    const thumbnailUrl = video.bestThumbnail.url
    const onVidClick = useCallback(() => {
        setVideo(video.id)
    }, [video, setVideo])
    return (
        <div className={clsx('play-list-item-container', {playing})}>
            {thumbnailUrl && <img
                src={thumbnailUrl}
                alt='thumbnail'
                loading='lazy'
            />}
            <div className='content'>
            <div className='title'>
                {title}
            </div>
            <div className="subtitle">
                {author?.name}
            </div>
            </div>
            <IconButton className={clsx('icon', {playing})} onClick={onVidClick} color='secondary'>
                <PlayCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default PlaylistItem