export const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

export const formatTime = (time: number) => {
    return `${zeroPad(Math.floor(time/60), 2)}:${zeroPad(time%60, 2)}`
}