import {createMuiTheme} from '@material-ui/core'

export const URL = 'https://sleepy-tundra-94597.herokuapp.com'

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