import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, CardMedia } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        marginTop: 20
    },
    content: {
        flex: 1
    },
    cover: {
        width: 150,
        minWidth: 150
    }
}))

interface Props {
    video: any;
    setVideo: (video: any) => void;
}

const VideoListItem = ({ video, setVideo }: Props) => {
    const { title, url } = video
    const classes = useStyles()
    const thumbnail = video.thumbnail.url
    const onVidClick = useCallback(() => {
        setVideo(video)
    }, [video, setVideo])
    return (
        <Card className={classes.root} onClick={onVidClick}>
            <CardMedia
                className={classes.cover}
                image={thumbnail}
                title={title}
            />
            <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                    {title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {url}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default VideoListItem