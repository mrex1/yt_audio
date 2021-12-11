import React, { useState, useCallback, useEffect, useContext } from "react"
import clsx from 'clsx'
import './PlaylistRenderer.css'
import {IconButton, LinearProgress, Typography} from '@material-ui/core'
import Up from '@material-ui/icons/ExpandLess'
import Down from '@material-ui/icons/ExpandMore'
import Player from './Player'
import VideoList from './VideoList'
import VideoListItem from "./VideoListItem"
import {Video, SuggestVideo} from '../types'
import {api} from '../services'
import {playlistActionContext} from '../context'

interface Props {
    playlistVideos: Array<Video>;
    currentIndex: number;
}

const PlaylistRenderer = ({playlistVideos, currentIndex}: Props) => {
    const [on, setOn] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<SuggestVideo[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [currentVId, setCurrentVId] = useState<string | null>(null)
    const {playVideo} = useContext(playlistActionContext)

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

    const onDownloadClick = useCallback((videoId: string) => {
        const a = api.getAudioDownloadLink(videoId)
        a.click()
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
        <div className={clsx('playlist', {open: on})}>
            <div className='top-section'>
                <div className='player-container'>
                {currentIndex >= playlistVideos.length?
                    <LinearProgress/> :
                    <Player videoDetails={playlistVideos[currentIndex]}/>}
                </div>
                <IconButton onClick={toggleExpand} color='secondary'>
                    {on ? <Down/> : <Up/>}
                </IconButton>
            </div>
            <div className='lists-container'>
            <div className={clsx('list')}>
                {playlistVideos
                    .map((info, id) =>
                        <VideoListItem
                            key={`playlist${id}`}
                            video={info}
                            onPlayClick={() => playVideo(id)}
                            onDownloadClick={onDownloadClick}
                            playing={id === currentIndex}/>)}
            </div>
            <Typography className={clsx('divider')} variant='h5' component='h5'>Suggested</Typography>
            {loading ?
                <div style={{paddingTop: 30, paddingBottom: 30}}><LinearProgress/></div> :
                <VideoList videos={suggestions} className={clsx('list')}/>
            }
            </div>
        </div>
    )
}

export default PlaylistRenderer