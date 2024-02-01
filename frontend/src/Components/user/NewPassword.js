import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassowrd, clearError } from '../../actions/userAction';
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


const NewPassword = ({ match, history }) => {
    const classes = useStyles();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, success } = useSelector(state => state.forogotPassword);

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (success) {
            history.push('/login')
            alert.success('Password Has Been Updated Successfully')
        }

    }, [dispatch, success, alert, error, history])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('password', password)
        formData.set('confirmPassword', confirmPassword)
        // here token if for reset
        dispatch(resetPassowrd(match.params.token, formData))
    }

    return (
        <Fragment>
            <Header />
            <MetaData title={'Reset Password'} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <VisibilityOffIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        New Password
                        </Typography>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password_field"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Confirm Password"
                            type="password"
                            id="confirm_password_field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            Set Password
                        </Button>
                    </form>
                </div>
            </Container>
        </Fragment>
    )
}

export default NewPassword
