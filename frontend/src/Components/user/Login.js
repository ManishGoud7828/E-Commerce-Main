import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../actions/userAction';
import Loader from '../Layouts/Loader';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import Header from '../Layouts/Header';

import {
    Avatar, Button, CssBaseline, TextField, Grid, Typography, Container
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = ({ history, location }) => {
    const dispatch = useDispatch();
    const Alert = useAlert();

    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (isAuthenticated) {
            history.push(redirect)
        }
        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

    }, [dispatch, Alert, error, isAuthenticated, history])

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(login(email, password))
    }

    const classes = useStyles();

    return (
        <Fragment>
            <Header />
            <Container component="main" maxWidth="xs">
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title={'Login'} />
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                                </Typography>
                            <form className={classes.form} onSubmit={submitHandler}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    Sign In
                                    </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link to="/password/forgot" >Forgot password?</Link>
                                    </Grid>
                                    <Grid item>
                                        <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Fragment>
                )}
            </Container>
        </Fragment>

    );
}
export default Login