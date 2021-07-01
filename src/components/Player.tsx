import React, { useCallback, useEffect, useRef, useState } from 'react'
import { URL } from '../constants'
import { Slider, IconButton, Typography, Tooltip, CircularProgress } from '@material-ui/core'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import { formatTime, durationToSeconds } from '../utils'
import { api } from '../services'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import DownloadIcon from '@material-ui/icons/GetApp'
import { Video } from 'ytsr'
import { SuggestVideo } from '../types'


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
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const fetchAudio = useCallback(async (videoDetails: Video | SuggestVideo) => {
        setCurVId(videoDetails.id)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.ontimeupdate = null
            setCurrentTime(0)
        }
        const audio = api.getAudio(videoDetails.id)
        if (!audio) return
        audio.ontimeupdate = () => {
            setCurrentTime(Math.ceil(audio.currentTime))
        }
        audio.addEventListener('ended', () => {
            setPlaying(false)
            if (onVideoEnd) {
                onVideoEnd()
            }
        })
        audio.addEventListener('pause', () => {
            setPlaying(false)
        })
        audio.addEventListener('play', () => {
            setPlaying(true)
            if (onVideoStart) {
                onVideoStart()
            }
        })
        audioRef.current = audio
        if (autoplay) {
            audio.play()
        }
    }, [onVideoEnd, onVideoStart, autoplay])

    useEffect(() => {
        if (!loading && curVId !== videoDetails.id) {
            setLoading(true)
            fetchAudio(videoDetails).then(() => setLoading(false))
        }
    }, [fetchAudio, loading, curVId, videoDetails])

    const download = useCallback(() => {
        const a = document.createElement('a')
        a.href = `${URL}/download?vid=${videoDetails.id}`
        a.target = '_blank'
        a.click()
    }, [videoDetails])

    const playOrPause = useCallback(() => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
        }
    }, [playing])

    const onSliderChange = useCallback((_, val) => {
        if (audioRef.current) {
            audioRef.current.currentTime = val
        }
    }, [])

    const handleAutoplayBtn = useCallback(() => {
        setAutoplay(!autoplay)
    }, [autoplay, setAutoplay])

    return (
        <div style={{ width: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '0px 0px 4px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ margin: 5, marginRight: 15 }}>{formatTime(currentTime)}</span>
                <Slider color='secondary' onChange={onSliderChange} max={durationToSeconds(videoDetails.duration)} min={0} value={currentTime} />
                <span style={{ margin: 5, marginLeft: 15 }}>{videoDetails.duration}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5, overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Typography variant="subtitle1" noWrap>{videoDetails.title}</Typography>
                    <Typography variant="subtitle2" style={{ color: 'silver' }} noWrap>{videoDetails.author?.name}</Typography>
                </div>
            </div>
        </div>
    )
}

export default Player