import { createContext } from 'react'
import { Video } from 'ytsr'
import { SuggestVideo } from '../types'

export const videoContext = createContext<{ videos: Array<Video | SuggestVideo>, setVideo: (videoId: string) => void }>({
    videos: [],
    setVideo: () => {}
})

export const autoplayContext = createContext<{autoplay: boolean, setAutoplay: (on: boolean) => void}>({
    autoplay: true,
    setAutoplay: () => {}
})

export const videoListenerContext = createContext<{onVideoEnd: () => void, onVideoStart: () => void}>({
    onVideoEnd: () => {},
    onVideoStart: () => {},
})