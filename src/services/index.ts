import { URL } from '../constants'
import { VideoCache, SuggestVideo, SuggestionsCache } from '../types'
import { Result as SearchResult, Video, Continuation, ContinueResult } from 'ytsr'

class API {
    private url: string
    private cache: VideoCache
    private suggestionsCache: SuggestionsCache
    constructor(url: string) {
        this.url = url
        this.cache = {}
        this.suggestionsCache = {}
    }
    public getInfo(videoId: string): Video | SuggestVideo {
        return this.cache[videoId]
    }
    public getAudio(videoId: string): HTMLAudioElement {
        const src = `${this.url}/stream?vid=${videoId}`
        const audio = new Audio(src)
        return audio
    }
    public async suggest(videoId: string): Promise<Array<SuggestVideo> | null> {
        if (videoId in this.suggestionsCache) {
            return this.suggestionsCache[videoId]
        }
        try {
            const res = await fetch(`${URL}/suggest?vid=${videoId}`)
            const result: SuggestVideo[] = await res.json()
            result.forEach(v => {
                if (!(v.id in this.cache)) {
                    this.cache[v.id] = v
                }
            })
            this.suggestionsCache[videoId] = result
            return result
        } catch (err) {
            return null
        }
    }
    public async search(searchTerm: string): Promise<SearchResult | null> {
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
    public async searchContinue(continuation: Continuation): Promise<ContinueResult | null> {
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
    get playlistVideos(): Array<Video | SuggestVideo> {
        return this.videoIds.map(id => this.api.getInfo(id))
    }
    setCurByVid(vid: string): number | void {
        const newCur = this.videoIds.indexOf(vid)
        if (newCur !== -1) {
            this.current = newCur
            return this.current
        }
    }
    async next(): Promise<number | void> {
        if (this.current < this.videoIds.length - 1) {
            this.current += 1
            return this.current
        }
        const suggestion = await this.suggest(this.videoIds[this.current])
        if (suggestion) {
            this.add(suggestion)
            return await this.next()
        }
    }
    // return a suggested video id that is not in the playlist
    private async suggest(videoId: string): Promise<string | void> {
        const suggestions = await this.api.suggest(videoId)
        if (suggestions) {
            for (let suggestion of suggestions) {
                if (this.videoIds.indexOf(suggestion.id) === -1) {
                    return suggestion.id
                }
            }
        }
    }
}

export const playlist = new Playlist(api)