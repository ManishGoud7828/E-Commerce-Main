import React, { useState, Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { register_user, clearError } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Header from '../Layouts/Header';

import {
    Avatar, Button, CssBaseline, TextField, Grid, Typography, Container, makeStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Register = ({ history }) => {
    const classes = useStyles();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = user;
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/image/preview.png');

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/')
        }
        if (error) {
            alert.error(error)
            dispatch(clearError());
        }

    }, [dispatch, alert, error, isAuthenticated, history])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name)
        formData.set('email', email)
        formData.set('password', password)
        formData.set('avatar', avatar)

        dispatch(register_user(formData))
    }

    const onChange = e => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();

            // when we readAsDataURL() we have to call back this onload()
            reader.onload = () => {
                // 3 types => 0 means reader has created, 1 means that it is inprocessing, 
                // 2 means that everything is ready
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])
        }
        else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                <Container component="main" maxWidth="xs">
                    <MetaData title={'Register User'} />
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                    </Typography>
                        <form className={classes.form} onSubmit={submitHandler} encType='multipart/form-data'>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="fname"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Name"
                                        autoFocus
                                        value={name}
                                        onChange={onChange}
                                        name="name"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        autoComplete="email"
                                        type="email"
                                        value={email}
                                        onChange={onChange}
                                        name="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={onChange}
                                        name="password"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={2}>
                                    <Avatar alt='Avatar Preview' src={avatarPreview} />
                                </Grid>

                                <Grid item xs={12} sm={10}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        type="file"
                                        id="customFile"
                                        accept="images/*"
                                        name="avatar"
                                        onChange={onChange}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                disabled={loading ? true : false}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link to='/login' variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </div>
        </Fragment>
    );
}

export default Register