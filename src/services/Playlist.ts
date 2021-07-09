import { SuggestVideo } from '../types'
import { Video } from 'ytsr'
import {API, api} from './API'

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