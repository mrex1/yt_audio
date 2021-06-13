import {createMuiTheme} from '@material-ui/core'

export const URL = 'https://main-youtube-shd6uy5b29ceuriw-gtw.qovery.io'

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#303030',
            main: '#000',
            dark: '#303030',
            contrastText: '#ffa600',
        },
        secondary: {
            light: '#fff',
            main: '#ffa600',
            dark: '#fff',
            contrastText: '#fff',
        }
    }
})