import {SuggestVideo} from '../types'

export const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

export const formatTime = (time: number) => {
    time = Math.ceil(time)
    return `${zeroPad(Math.floor(time/60), 2)}:${zeroPad(time%60, 2)}`
}

export const durationToSeconds = (duration: string | null): number => {
    if (duration === null) {
        return 0
    }
    const numbers = duration.split(':')
    let result: number = 0
    let base = 1
    for (let i = 0 ; i < numbers.length ; i++) {
        result += parseInt(numbers[numbers.length - 1 - i])*base
        base *= 60
    }
    return result
}

export const isSuggestVideo = (obj: any): obj is SuggestVideo => {
    return obj.thumbnail
}

export const openLink = (link: string) => {
    const a = document.createElement('a')
    a.href = link
    a.target = '_blank'
    a.rel = 'no-referrer'
    a.click()
}

export const sleep = (time: number) => {
    return new Promise((res, _) => setTimeout(res, time))
}