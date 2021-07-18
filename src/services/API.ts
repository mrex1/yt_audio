import {URL} from '../constants'
import { VideoCache, SuggestVideo, SuggestionsCache } from '../types'
import { Result as SearchResult, Video, Continuation, ContinueResult } from 'ytsr'
import { Result as PlaylistResult, Continuation as PlaylistContinuation, ContinueResult as PlaylistContinueResult} from 'ytpl'

export class API {
    private url: string
    private cache: VideoCache
    private suggestionsCache: SuggestionsCache
    constructor(url: string) {
        this.url = url
        this.cache = {}
        this.suggestionsCache = {}
    }
    public getYoutubeLink(videoId: string): string {
        return `https://youtu.be/${videoId}`
    }
    public getInfo(videoId: string): Video | SuggestVideo {
        return this.cache[videoId]
    }
    public getAudioURL(videoId: string): string {
        return `${this.url}/stream/v2?vid=${videoId}`
    }
    public getAudioDownloadLink(videoId: string): HTMLAnchorElement {
        const a = document.createElement('a')
        a.href = `${this.url}/download?vid=${videoId}`
        a.target = '_blank'
        return a
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
        const formatSearchTearm = encodeURIComponent(searchTerm.replace(' ', '+'))
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
    public async getYTPlaylist(id: string): Promise<PlaylistResult | null> {
        try {
            const res = await fetch(`${URL}/playlist?pid=${id}`)
            const playlist: PlaylistResult = await res.json()
            return playlist
        } catch (err) {
            return null
        }
    }
    public async getYTplaylistByContinuation(continuation: PlaylistContinuation): Promise<PlaylistContinueResult | null> {
        try {
            const res = await fetch(`${URL}/playlist`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(continuation)
            })
            const result: PlaylistContinueResult = await res.json()
            return result
        } catch (err) {
            return null
        }
    }
}

export const api = new API(URL);