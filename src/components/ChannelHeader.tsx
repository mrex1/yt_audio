import React from 'react'
import { ChannelInfo } from '../types'
import { Avatar } from '@material-ui/core'
import './ChannelHeader.css'

interface Props {
    channelInfo: ChannelInfo
}

const ChannelHeader = ({ channelInfo }: Props) => {
    return (
        <div className='channel-header-container'>
            {channelInfo.bestAvatar.url ?
                <Avatar className='avatar' alt={channelInfo.name} src={channelInfo.bestAvatar.url}/> :
                <Avatar className='avatar'>{channelInfo.name[0]}</Avatar>}
            <span className='name'>{channelInfo.name}</span>
        </div>
    )
}

export default ChannelHeader