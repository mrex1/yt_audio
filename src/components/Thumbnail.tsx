import React from 'react'
import "./Thumbnail.css"

interface Props{
    thumbnailUrl: string;
    duration: string | null;
}

const Thumbnail = ({thumbnailUrl, duration}: Props) => {
    return (
    <div className='thumbnail-container'>
        <img
            className='thumbnail-img'
            src={thumbnailUrl}
            alt='thumbnail'
            loading='lazy'
        />
        <span className='thumbnail-txt'>{duration}</span>
    </div>)
}

export default Thumbnail