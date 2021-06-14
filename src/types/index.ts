export interface Video {
    title: string;
    videoId: string;
    thumbnailUrl: string;
}

export interface VideoDetails extends Video {
    author: string;
    lengthSeconds: number;
}

export interface VideoInfo {
    related_videos: Array<VideoDetails>;
    videoDetails: VideoDetails;
}

export interface VideoCache {
    [videoId: string]: VideoInfo
}