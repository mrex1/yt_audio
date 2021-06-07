import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'react-h5-audio-player/lib/styles.css'
import {URL} from '../constants'
import {Slider, Button} from '@material-ui/core'
import {formatTime} from '../utils'
import {api} from '../services'

interface Props{
    videoId: string;
}

const Player = ({videoId}: Props) => {
    const [playing, setPlaying] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [duration, setDuration] = useState<number>(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    useEffect(() => {
        if (videoId) {
            api.getInfo(videoId).then(info => {
                setDuration(parseInt(info.videoDetails.lengthSeconds))
            })
            if (audioRef.current) {
                audioRef.current.pause()
                setPlaying(false)
            }
            const audio = api.getAudio(videoId)
            audio.ontimeupdate = () => {
                setCurrentTime(Math.round(audio.currentTime))
            }
            audioRef.current = audio
        }
    }, [videoId])
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
        {videoId &&
            <div style={{width: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span>{formatTime(currentTime)}</span>
                    <Slider onChange={onSliderChange} max={duration} min={0} value={currentTime}/>
                    <span>{formatTime(duration)}</span>
                </div>
                <Button onClick={playOrPause} fullWidth variant='contained' color='primary'>{playing ? 'pause' : 'play'}</Button>
            </div>
         }
        <Button onClick={download} fullWidth variant='contained' color='primary'>download</Button>
        </div>
    )
}

export default Player