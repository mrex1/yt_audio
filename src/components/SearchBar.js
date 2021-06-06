import React, { useCallback } from 'react'
import { TextField, AppBar, Toolbar } from '@material-ui/core'


const SearchBar = ({ onChange, onSubmit }) => {
    const onKeyPress = useCallback(evt => {
        if (evt.charCode === 13) {
            onSubmit()
            evt.target.blur()
        }
    }, [onSubmit])
    return (
            <AppBar position='static'>
                <Toolbar>
                    <TextField
                    color='secondary'
                    label="Search" variant="standard" onChange={onChange} onKeyPress={onKeyPress} fullWidth />
                </Toolbar>
            </AppBar>)
}

export default SearchBar