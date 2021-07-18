import {Video as SearchVideo, Image, Continuation as SearchContinuation} from 'ytsr'
import {Item as YTPlaylistItem, Continuation as YTPlaylistContinuation} from 'ytpl'

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

export type VideoLoader = () => Promise<{
    videos: Array<Video>,
    continuation?: SearchContinuation | YTPlaylistContinuation | null,
    channel?: string}>