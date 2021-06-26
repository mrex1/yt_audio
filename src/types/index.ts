import {Video} from 'ytsr'

export interface VideoCache {
    [videoId: string]: Video
}