import React, { useState } from 'react';
import { fade, makeStyles, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '100%',
            maxWidth: '50%'
        },
    },

    inputRoot: { color: 'inherit', },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),                
        paddingLeft:theme.spacing(0),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '70ch',
            paddingLeft:theme.spacing(2),
        }
    },
}))

const Search = ({ history }) => {
    const [keyword, setKeyword] = useState('');

    const changeHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/search/${keyword}`)
        }
        else {
            history.push('/')
        }
    }

    const classes = useStyles();
    return (

        <div className={classes.search}>            
            <form onSubmit={changeHandler}>
                <div className='d-flex justify-content-lg-between'>
                    <IconButton className={classes.inputRoot} onClick={changeHandler}>
                        <SearchIcon />
                    </IconButton>

                    <InputBase
                        placeholder="Enter Product Name.."
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        type="text"
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                </div>
            </form>
        </div>
    )
}

export default Search
