import React, { useCallback } from 'react'
import { Input, InputAdornment, IconButton } from '@material-ui/core'
import Search from '@material-ui/icons/Search'

const SearchBar = ({onChange, onSubmit}) => {
    const onKeyPress = useCallback(evt => {
        if (evt.charCode === 13) {
            onSubmit()
            evt.target.blur()
        }
    }, [onSubmit])
    return (<div>
        <Input
        label="Search"
        onChange={onChange}
        fullWidth
        onKeyPress={onKeyPress}
        endAdornment={
            <InputAdornment position="end">
                <IconButton
                aria-label="search"
                onClick={onSubmit}
                >
                <Search/>
                </IconButton>
            </InputAdornment>
        }/>
    </div>)
}

export default SearchBar