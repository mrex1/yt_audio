import {Video as SearchVideo, Image} from 'ytsr'
import {Item as YTPlaylistItem} from 'ytpl'

export interface VideoCache {
    [videoId: string]: Video
}

export interface SuggestionsCache {
    [videoId: string]: Array<SuggestVideo>
}

export interface SuggestVideo {
    thumbnail: Image,
    author: {
        name: string;
        channelID: string;
        avatar: Image;
    },
    title: string,
    id: string,
    duration: string
}

export type Video = SearchVideo | YTPlaylistItem | SuggestVideo