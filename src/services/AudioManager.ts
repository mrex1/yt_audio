import {API, api} from './API'

export class AudioManager {
    public audio: HTMLAudioElement
    private vid?: string;
    private api: API
    constructor(api: API, vid?: string) {
        this.api = api
        this.audio = new Audio()
        if (vid) {
            this.updateAudio(vid)
        }
    }

    public updateAudio(vid: string): void {
        if (vid === this.vid) return
        this.vid = vid
        const url = this.api.getAudioURL(vid)
        this.audio.src = url
    }

    public retry(): void {
        const originalSrc = this.audio.src
        this.audio.src = ''
        this.audio.src = originalSrc
    }
}

export const audioManager = new AudioManager(api);