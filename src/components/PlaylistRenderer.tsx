import React, { useState, useCallback } from "react"
import clsx from 'clsx'
import './PlaylistRenderer.css'
import {IconButton, LinearProgress, Typography} from '@material-ui/core'
import Up from '@material-ui/icons/ExpandLess'
import Down from '@material-ui/icons/ExpandMore'
import Player from './Player'
import VideoList from './VideoList'
import {VideoInfo} from '../types'

interface Props {
    playlistVideos: Array<VideoInfo>;
    currentIndex: number | null;
    onVideoEnd?: () => void;
    onVideoStart?: () => void;
}

const PlaylistRenderer = ({playlistVideos, currentIndex, onVideoEnd, onVideoStart}: Props) => {
    const [on, setOn] = useState<boolean>(false)

    const toggleExpand = useCallback(() => {
        setOn(!on)
    }, [on])

    return (
        currentIndex !== null ?
        <div className={clsx('playlist', {open: on})}>
            <div className='top-section'>
                <div className='player-container'>
                {currentIndex >= playlistVideos.length?
                    <LinearProgress/> :
                    <Player videoDetails={playlistVideos[currentIndex].videoDetails} onVideoEnd={onVideoEnd} onVideoStart={onVideoStart}/>}
                </div>
                <IconButton onClick={toggleExpand} color='secondary'>
                    {on ? <Down/> : <Up/>}
                </IconButton>
            </div>
            <div className='lists-container'>
            <VideoList className={clsx({hide: !on}, 'list')} videos={playlistVideos.map(info => info.videoDetails)} setVideo={()=>{}}/>
            <Typography className={clsx({hide: !on}, 'divider')} variant='h5' component='h5'>Suggested</Typography>
            {currentIndex < playlistVideos.length && <VideoList className={clsx({hide: !on}, 'list')} videos={playlistVideos[currentIndex].related_videos} setVideo={()=>{}}/>}
            </div>
        </div> : null
    )
}

export default PlaylistRenderer