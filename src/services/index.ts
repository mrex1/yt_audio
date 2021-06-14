import {URL} from '../constants'
import {Video, VideoCache, VideoDetails, VideoInfo} from '../types'

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
        data.videoDetails.thumbnailUrl = data.videoDetails.thumbnail.thumbnails[0].url
        this.cache[videoId] = data
        data.related_videos = data.related_videos.map((v: any): VideoDetails => {
            const videoId = v.id
            const thumbnailUrl = v.thumbnails[0].url
            const title = v.title
            const author = v.author.name
            const lengthSeconds = v.length_seconds
            return {videoId, thumbnailUrl, title, author, lengthSeconds}
        })
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
        const finalResult = result.map((v: any) => {
            v.videoId = v.id
            v.thumbnailUrl = v.thumbnail.url
            return v
        })
        return finalResult
    }
}

export const api = new API(URL)

export class Playlist {
    private videoIds: Array<string>;
    private videoInfos: VideoCache;
    public current: number;
    private api: API;
    constructor(api: API, videoIds?: Array<string>) {
        this.videoIds = videoIds ? videoIds : []
        this.current = -1
        this.videoInfos = {}
        this.api = api
        this.add = this.add.bind(this)
        this.next = this.next.bind(this)
    }
    async add(videoId: string) {
        this.videoIds.push(videoId)
        const info = await this.api.getInfo(videoId)
        this.videoInfos[videoId] = info
    }
    get playlistVideos(): Array<VideoInfo> {
        return this.videoIds.map(id => this.videoInfos[id])
    }
    next(): number | void {
        if (this.current < this.videoIds.length - 1) {
            this.current += 1
            return this.current
        }
    }
}

export const playlist = new Playlist(api)