import React, { useState, useCallback, useEffect } from "react"
import clsx from 'clsx'
import './PlaylistRenderer.css'
import {IconButton, LinearProgress, Typography} from '@material-ui/core'
import Up from '@material-ui/icons/ExpandLess'
import Down from '@material-ui/icons/ExpandMore'
import Player from './Player'
import VideoList from './VideoList'
import {Video} from 'ytsr'
import PlaylistItem from "./PlaylistItem"
import {SuggestVideo} from '../types'
import {api} from '../services'

interface Props {
    playlistVideos: Array<Video | SuggestVideo>;
    currentIndex: number;
    onVideoEnd?: () => void;
    onVideoStart?: () => void;
    autoplay: boolean;
    setAutoplay: (on: boolean) => void;
    playVideo: (id: number) => void;
    onAdd: (videoId: string) => void;
}

const PlaylistRenderer = ({playlistVideos, currentIndex, onVideoEnd, onVideoStart, playVideo, onAdd, autoplay, setAutoplay}: Props) => {
    const [on, setOn] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<SuggestVideo[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [currentVId, setCurrentVId] = useState<string | null>(null)

    const toggleExpand = useCallback(() => {
        setOn(!on)
    }, [on])

    const getSuggestions = useCallback(async (vid: string) => {
        setLoading(true)
        const res = await api.suggest(vid)
        if (res) {
            setSuggestions(res)
        } else {
            setSuggestions([])
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (currentVId) {
            getSuggestions(currentVId)
        }
    }, [currentVId, getSuggestions])

    useEffect(() => {
        setCurrentVId(playlistVideos[currentIndex]?.id)
    }, [currentIndex, playlistVideos])

    return (
        currentIndex !== -1 ?
        <div className={clsx('playlist', {open: on})}>
            <div className='top-section'>
                <div className='player-container'>
                {currentIndex >= playlistVideos.length?
                    <LinearProgress/> :
                    <Player autoplay={autoplay} setAutoplay={setAutoplay} videoDetails={playlistVideos[currentIndex]} onVideoEnd={onVideoEnd} onVideoStart={onVideoStart}/>}
                </div>
                <IconButton onClick={toggleExpand} color='secondary'>
                    {on ? <Down/> : <Up/>}
                </IconButton>
            </div>
            <div className='lists-container'>
            <div className={clsx('list')}>
                {playlistVideos
                    .map((info, id) =>
                        <PlaylistItem key={`playlist${id}`} video={info} setVideo={() => playVideo(id)} playing={id === currentIndex}/>)}
            </div>
            <Typography className={clsx('divider')} variant='h5' component='h5'>Suggested</Typography>
            {loading ?
                <div style={{paddingTop: 30, paddingBottom: 30}}><LinearProgress/></div> : <VideoList className={clsx('list')} videos={suggestions} setVideo={onAdd}/>
            }
            </div>
        </div> : null
    )
}

export default PlaylistRenderer