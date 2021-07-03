import React, { useCallback, useEffect, useState } from 'react'
import { Slider, IconButton, Typography, Tooltip, CircularProgress } from '@material-ui/core'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import { formatTime, durationToSeconds } from '../utils'
import { api, audioManager } from '../services'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import DownloadIcon from '@material-ui/icons/GetApp'
import { Video } from 'ytsr'
import { SuggestVideo } from '../types'
import './Player.css'


interface Props {
    videoDetails: Video | SuggestVideo;
    onVideoEnd?: () => void;
    onVideoStart?: () => void;
    autoplay: boolean;
    setAutoplay: (on: boolean) => void;
}

const Player = ({ videoDetails, onVideoEnd, onVideoStart, autoplay, setAutoplay }: Props) => {
    const [playing, setPlaying] = useState<boolean>(false)
    const [curVId, setCurVId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState<number>(0)

    useEffect(() => {
        audioManager.audio.ontimeupdate = () => setCurrentTime(Math.ceil(audioManager.audio.currentTime))
        audioManager.audio.onpause = () => setPlaying(false)
        audioManager.audio.onloadeddata = () => setLoading(false)
        audioManager.audio.onloadstart = () => setLoading(true)
    }, [])

    useEffect(() => {
        audioManager.audio.onplay = () => {
            setPlaying(true)
            if (onVideoStart) {
                onVideoStart()
            }
        }
        audioManager.audio.onended = () => {
            setPlaying(false)
            if (onVideoEnd) {
                onVideoEnd()
            }
        }
    }, [onVideoStart, onVideoEnd])

    const setupForNewVideo = useCallback((videoDetails: Video | SuggestVideo) => {
        setCurVId(videoDetails.id)
        audioManager.updateAudio(videoDetails.id)
        setCurrentTime(0)
        if (autoplay) {
            audioManager.audio.play().catch(console.log)
        }
    }, [autoplay])

    useEffect(() => {
        if (curVId !== videoDetails.id) {
            setupForNewVideo(videoDetails)
        }
    }, [setupForNewVideo, curVId, videoDetails])

    const download = useCallback(() => {
        const a = api.getAudioDownloadLink(videoDetails.id)
        a.click()
    }, [videoDetails])

    const playOrPause = useCallback(() => {
        if (playing) {
            audioManager.audio.pause()
        } else {
            audioManager.audio.play()
        }
    }, [playing])

    const onSliderChange = useCallback((_, val) => {
        audioManager.audio.currentTime = val
    }, [])

    const handleAutoplayBtn = useCallback(() => {
        setAutoplay(!autoplay)
    }, [autoplay, setAutoplay])

    return (
        <div className='player-container'>
            <div className='player-progress-container'>
                <span style={{ margin: 5, marginRight: 15 }}>{formatTime(currentTime)}</span>
                <Slider color='secondary' onChange={onSliderChange} max={durationToSeconds(videoDetails.duration)} min={0} value={currentTime} />
                <span style={{ margin: 5, marginLeft: 15 }}>{videoDetails.duration}</span>
            </div>
            <div className='player-bottom-container'>
                {loading ? <div style={{ padding: 12 }}><CircularProgress color='secondary' size={22} /></div> :
                    <IconButton onClick={playOrPause} color='secondary'>
                        {playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>}
                <IconButton onClick={download} color='secondary'>
                    <DownloadIcon />
                </IconButton>
                <Tooltip title="autoplay">
                    <IconButton onClick={handleAutoplayBtn} color='secondary'>
                        {autoplay ? <PauseCircleFilledIcon /> : <PlayCircleFilledIcon />}
                    </IconButton>
                </Tooltip>
                <div className='player-details-container'>
                    <Typography variant="subtitle1" noWrap>{videoDetails.title}</Typography>
                    <Typography variant="subtitle2" style={{ color: 'silver' }} noWrap>{videoDetails.author?.name}</Typography>
                </div>
            </div>
        </div>
    )
}

export default Player