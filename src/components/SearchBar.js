import React from 'react'
import { Input, InputAdornment, IconButton } from '@material-ui/core'
import Search from '@material-ui/icons/Search'

const SearchBar = ({onChange, onSubmit}) => {
    return (<div>
        <Input label="Search" onChange={onChange} fullWidth
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