import {Video, Image} from 'ytsr'

export interface VideoCache {
    [videoId: string]: Video | SuggestVideo
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