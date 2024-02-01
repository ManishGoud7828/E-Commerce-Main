import React, { useState, Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassowrd, clearError } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import Header from '../Layouts/Header';

import {
    Avatar, Button, CssBaseline, TextField, Grid, Typography, Container, makeStyles
} from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';

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


const UpdatePassword = ({ history }) => {
    const classes = useStyles();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, isUpdated } = useSelector(state => state.user);

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (isUpdated) {
            alert.success('Password Has Been Updated!')

            history.push('/me')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, history, alert, error, isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('oldPassword', oldPassword)
        formData.set('password', password)

        dispatch(updatePassowrd(formData))
    }
    return (
        <Fragment>
            <Header />
            <Container component="main" maxWidth="xs">
                <MetaData title={'Change Password'} />
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <UpdateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Password
                    </Typography>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Old Password"
                                    type="password"
                                    id="old_password_field"
                                    autoComplete="current-password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    id="new_password_field"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            Update Password
                    </Button>
                    </form>
                </div>
            </Container>
        </Fragment>

    )
}

export default UpdatePassword
