import {createMuiTheme} from '@material-ui/core'

export const URL = 'http://192.168.0.116:3001'

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#50b1de',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#757ce8',
            main: '#000',
            dark: '#002884',
            contrastText: '#fff',
        }
    }
})