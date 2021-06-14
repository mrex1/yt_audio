import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import {URL} from '../constants'
import {Slider, IconButton, Typography} from '@material-ui/core'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import {formatTime} from '../utils'
import {api} from '../services'
import {VideoDetails} from '../types'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import DownloadIcon from '@material-ui/icons/GetApp';


interface Props{
    videoDetails: VideoDetails;
    onVideoEnd: () => void;
}

const Player = ({videoDetails, onVideoEnd}: Props) => {
    const [playing, setPlaying] = useState<boolean>(false)
    const [curVId, setCurVId] = useState<string | null>(null)
    const [autoplay, setAutoplay] = useState<boolean>(true)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const fetchAudio = useCallback(async () => {
            if (curVId === videoDetails.videoId) {
                return
            }
            setCurVId(videoDetails.videoId)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            const audio = api.getAudio(videoDetails.videoId)
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(Math.round(audio.currentTime))
            })
            audio.addEventListener('ended', () => {
                setPlaying(false)
                onVideoEnd()
            })
            audio.addEventListener('pause', () => {
                setPlaying(false)
            })
            audio.addEventListener('play', () => {
                setPlaying(true)
            })
            audioRef.current = audio
            if (autoplay) {
                audio.play()
            }
    }, [videoDetails, onVideoEnd, autoplay, curVId])
    useEffect(() => {
        fetchAudio()
    }, [fetchAudio])
    const download = useCallback(() => {
        const a = document.createElement('a')
        a.href = `${URL}/download/${videoDetails.videoId}`
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
    }, [autoplay])
    return (
        <div style={{width: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '0px 0px 4px rgba(0,0,0,0.5)'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <span style={{margin: 5, marginRight: 15}}>{formatTime(currentTime)}</span>
                <Slider color='secondary' onChange={onSliderChange} max={videoDetails.lengthSeconds} min={0} value={currentTime}/>
                <span style={{margin: 5, marginLeft: 15}}>{formatTime(videoDetails.lengthSeconds)}</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <IconButton onClick={playOrPause} color='secondary'>
                    {playing ? <PauseIcon/> : <PlayArrowIcon/>}
                </IconButton>
                <IconButton onClick={download} color='secondary'>
                    <DownloadIcon/>
                </IconButton>
                <IconButton onClick={handleAutoplayBtn} color='secondary'>
                    {autoplay ? <PauseCircleFilledIcon/> : <PlayCircleFilledIcon/>}
                </IconButton>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5, overflow: "hidden", textOverflow: "ellipsis"}}>
                <Typography variant="subtitle1" noWrap>{videoDetails.title}</Typography>
                    <Typography variant="subtitle2" style={{color: 'silver'}} noWrap>{videoDetails.author}</Typography>
                </div>
            </div>
        </div>
    )
}

export default Player