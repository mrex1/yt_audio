import React, { useCallback, useState } from 'react'
import { Input, AppBar, Toolbar, InputAdornment, IconButton, Typography } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import SearchIcon from '@material-ui/icons/Search'
import './SearchBar.css'

interface Props{
    onChange: (evt: any) => void;
    onSubmit: () => void;
}

const SearchBar = ({ onChange, onSubmit }: Props) => {
    const [input, setInput] = useState<string>('')
    const [inputMode, setInputMode] = useState<boolean>(false)

    const onKeyPress = useCallback(evt => {
        if (evt.charCode === 13) {
            onSubmit()
            evt.target.blur()
        }
    }, [onSubmit])

    const handleInputChange = useCallback(evt => {
        setInput(evt.target.value)
        onChange(evt)
    }, [onChange])

    const handleClear = useCallback(() => {
        setInput('')
    }, [])

    const handleBack = useCallback(() => {
        setInputMode(false)
    }, [])

    const handleSearch = useCallback(() => {
        setInputMode(true)
    }, [])
    return (
            <AppBar position='static'>
                {inputMode ?
                <Toolbar>
                    <IconButton color='secondary' edge="start" onClick={handleBack}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                    <Input
                        color='secondary'
                        style={{color: 'white'}}
                        placeholder="Search"
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={onKeyPress}
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="clear input"
                                color='secondary'
                                onClick={handleClear}>
                                    <ClearIcon/>
                                </IconButton>
                            </InputAdornment>
                        }/>
                </Toolbar> : 
                <Toolbar>
                    <Typography style={{flex: 1}}>YT Audio</Typography>
                    <IconButton color='secondary' onClick={handleSearch}>
                        <SearchIcon/>
                    </IconButton>
                </Toolbar>}
            </AppBar>)
}

export default SearchBar