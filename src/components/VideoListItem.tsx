import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, CardMedia } from '@material-ui/core'
import {Video} from '../types'

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
    video: Video;
    setVideo: (video: Video) => void;
}

const VideoListItem = ({ video, setVideo }: Props) => {
    const { title, id } = video
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
                <Typography component="h6" variant="h6">
                    {title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {id}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default VideoListItem