import {URL} from '../constants'
import {Video} from '../types'

class API {
    private url: string
    constructor(url: string) {
        this.url = url
    }
    public async getInfo (videoId: string): Promise<any> {
        const res = await fetch(`${this.url}/info/${videoId}`)
        const data = await res.json()
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