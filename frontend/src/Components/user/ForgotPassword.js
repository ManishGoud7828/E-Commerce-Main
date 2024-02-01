import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassowrd, clearError } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Header from '../Layouts/Header';
import {
    Avatar, Button, CssBaseline, makeStyles, TextField, Typography, Container
} from '@material-ui/core';

import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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

const ForgotPassword = () => {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, message } = useSelector(state => state.forogotPassword);

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (message) {
            alert.success(message)
        }

    }, [dispatch, message, alert, error])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email)

        dispatch(forgotPassowrd(formData))
    }

    return (
        <Fragment>
            <Header />
            <MetaData title={'Forgot Password'} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <VisibilityOffIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Forgot Password
                            </Typography>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Enter Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            disabled={loading ? true : false}
                        >
                            Send Email
                        </Button>
                    </form>
                </div>
            </Container>
        </Fragment>
    )
}

export default ForgotPassword
