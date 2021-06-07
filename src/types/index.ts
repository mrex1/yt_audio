export interface Video {
    title: string;
    id: string;
    thumbnail: {
        url: string;
    }
}

export interface VideoDetails {
    title: string;
    author: string;
    videoId: string;
    lengthSeconds: number;
}

export interface VideoInfo {
    related_videos: Array<any>;
    videoDetails: VideoDetails;
}

export interface VideoCache {
    [videoId: string]: VideoInfo
}