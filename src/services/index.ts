import {URL} from '../constants'
import {VideoCache} from '../types'
import {Result as SearchResult, Video, Continuation, ContinueResult} from 'ytsr'

class API {
    private url: string
    private cache: VideoCache
    constructor(url: string) {
        this.url = url
        this.cache = {}
    }
    public getInfo (videoId: string): Video {
        return this.cache[videoId]
    }
    public getAudio (videoId: string): HTMLAudioElement {
        const src = `${this.url}/stream?vid=${videoId}`
        const audio = new Audio(src)
        return audio
    }
    public async search (searchTerm: string): Promise<SearchResult | null> {
        const formatSearchTearm = searchTerm.split(' ').join('+')
        try {
            const res = await fetch(`${URL}/search?q=${formatSearchTearm}`)
            const result: SearchResult = await res.json()
            result.items.forEach(i => {
                if (i.type === 'video') {
                    this.cache[i.id] = i
                }
            })
            return result
        } catch (err) {
            return null
        }
    }
    public async searchContinue(continuation: Continuation) : Promise<ContinueResult | null> {
        try {
            const res = await fetch(`${URL}/search`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(continuation)
            })
            const result: SearchResult = await res.json()
            result.items.forEach(i => {
                if (i.type === 'video') {
                    this.cache[i.id] = i
                }
            })
            return result
        } catch (err) {
            return null
        }
    }
}

export const api = new API(URL);

(window as any).api = api
export class Playlist {
    private videoIds: Array<string>;
    public current: number;
    private api: API;
    constructor(api: API, videoIds?: Array<string>) {
        this.videoIds = videoIds ? videoIds : []
        this.current = -1
        this.api = api
        this.add = this.add.bind(this)
        this.next = this.next.bind(this)
    }
    add(videoId: string) {
        if (this.videoIds.indexOf(videoId) === -1) {
            this.videoIds.push(videoId)
        }
    }
    get playlistVideos(): Array<Video> {
        return this.videoIds.map(id => this.api.getInfo(id))
    }
    setCurByVid(vid: string): number | void {
        const newCur = this.videoIds.indexOf(vid)
        if (newCur !== -1) {
            this.current = newCur
            return this.current
        }
    }
    next(): number | void {
        if (this.current < this.videoIds.length - 1) {
            this.current += 1
            return this.current
        }
    }
    suggest(): string | void {
        return
    }
}

export const playlist = new Playlist(api)