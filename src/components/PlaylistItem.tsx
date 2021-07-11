import React, {useCallback} from 'react'
import {Video} from 'ytsr'
import {api} from '../services'
import {SuggestVideo} from '../types'
import { isSuggestVideo } from '../utils'
import {IconButton} from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LaunchIcon from '@material-ui/icons/Launch'
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

    const onLaunchClick = useCallback(() => {
        const a = document.createElement('a')
        a.href = api.getYoutubeLink(video.id)
        a.target = '_blank'
        a.rel = 'no-referrer'
        a.click()
    }, [video])

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
                <div className='play-list-item-row tools'>
                    <IconButton className={clsx('icon', {playing})} onClick={playVideo} color='secondary'>
                        <PlayCircleOutlineIcon/>
                    </IconButton>
                    <IconButton onClick={onLaunchClick} color='secondary'>
                        <LaunchIcon/>
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default PlaylistItem