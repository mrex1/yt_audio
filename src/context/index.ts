import { createContext } from 'react'
import { VideoLoader } from '../types'

export const mainScreenVideoContext = createContext<{
    setVideosWithLoading: (loadVideos: VideoLoader) => Promise<void>
}>({
    setVideosWithLoading: async () => {}
})

export const playlistActionContext = createContext<{
    playVideo: (index: number) => void,
    addToPlaylist: (videoId: string) => void,
    addToPlaylistThenPlay: (videoId: string) => void
}>({
    playVideo: () => { },
    addToPlaylist: () => { },
    addToPlaylistThenPlay: () => { }
})

export const autoplayContext = createContext<{ autoplay: boolean, setAutoplay: (on: boolean) => void }>({
    autoplay: true,
    setAutoplay: () => { }
})

export const videoListenerContext = createContext<{ onVideoEnd: () => void, onVideoStart: () => void }>({
    onVideoEnd: () => { },
    onVideoStart: () => { },
})