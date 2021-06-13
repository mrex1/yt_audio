import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import {URL} from '../constants'
import {Slider, IconButton, Typography, LinearProgress} from '@material-ui/core'
import {formatTime} from '../utils'
import {api} from '../services'
import {VideoDetails} from '../types'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import DownloadIcon from '@material-ui/icons/GetApp';


interface Props{
    videoId: string;
}

const Player = ({videoId}: Props) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [playing, setPlaying] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const fetchAudio = useCallback(async () => {
        if (videoId) {
            setLoading(true)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            const audio = api.getAudio(videoId)
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(Math.round(audio.currentTime))
            })
            audio.addEventListener('ended', () => {
                setPlaying(false)
            })
            audioRef.current = audio
            const info = await api.getInfo(videoId)
            setPlaying(false)
            setVideoDetails(info.videoDetails)
            setLoading(false)
        }
    }, [videoId])
    useEffect(() => {
        fetchAudio()
    }, [fetchAudio])
    const download = useCallback(() => {
        const a = document.createElement('a')
        a.href = `${URL}/download/${videoId}`
        a.target = '_blank'
        a.click()
    }, [videoId])
    const playOrPause = useCallback(() => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setPlaying(!playing)
        }
    }, [playing])
    
    
    const onSliderChange = useCallback((_, val) => {
        if (audioRef.current) {
            audioRef.current.currentTime = val
        }
    }, [])
    return (
        <div style={{position: 'fixed', bottom: 0, width: '100%'}}>
        {loading ? <LinearProgress/> : (videoDetails &&
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
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 5, overflow: "hidden", textOverflow: "ellipsis"}}>
                    <Typography variant="subtitle1" noWrap>{videoDetails.title}</Typography>
                        <Typography variant="subtitle2" color="textSecondary" noWrap>{videoDetails.author}</Typography>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}

export default Player