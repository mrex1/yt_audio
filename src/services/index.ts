import {URL} from '../constants'
import {Video, VideoCache, VideoInfo} from '../types'

class API {
    private url: string
    private cache: VideoCache
    constructor(url: string) {
        this.url = url
        this.cache = {}
    }
    public async getInfo (videoId: string): Promise<VideoInfo> {
        const cachedInfo = this.cache[videoId]
        if (cachedInfo) {
            return cachedInfo
        }
        const res = await fetch(`${this.url}/info/${videoId}`)
        const data = await res.json()
        data.videoDetails.lengthSeconds = parseInt(data.videoDetails.lengthSeconds)
        this.cache[videoId] = data
        return data
    }
    public getAudio (videoId: string): HTMLAudioElement {
        const src = `${this.url}/stream/${videoId}`
        const audio = new Audio(src)
        return audio
    }
    public async search (searchTerm: string): Promise<Array<Video>> {
        const formatSearchTearm = searchTerm.split(' ').join('+')
        const res = await fetch(`${URL}/search/` + formatSearchTearm)
        const result = await res.json()
        return result
    }
}

export const api = new API(URL)