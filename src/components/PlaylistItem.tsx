import React from 'react'
import {Video} from 'ytsr'
import {SuggestVideo} from '../types'
import { isSuggestVideo } from '../utils'
import {IconButton} from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import clsx from 'clsx'
import './PlaylistItem.css'

interface Props {
    video: Video | SuggestVideo;
    playing?: boolean;
    playVideo: () => void;
}

const PlaylistItem = ({ video, playing, playVideo }: Props) => {
    const { title, author } = video
    const thumbnailUrl = isSuggestVideo(video) ? video.thumbnail.url : video.bestThumbnail.url

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
            <IconButton className={clsx('icon', {playing})} onClick={playVideo} color='secondary'>
                <PlayCircleOutlineIcon/>
            </IconButton>
        </div>
    )
}

export default PlaylistItem