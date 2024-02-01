import React, { useState,Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError, load_user } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstant'
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

const UpdateProfile = ({ history }) => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/image/preview.png');

    const dispatch = useDispatch();
    const alert = useAlert();

    const { user } = useSelector(state => state.auth);
    const { loading, error, isUpdated } = useSelector(state => state.user);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (isUpdated) {
            alert.success('Profile Has Been Updated!')
            // pull fresh/update data
            dispatch(load_user());

            history.push('/me')

            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [dispatch, history, alert, error, isUpdated])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name)
        formData.set('email', email)
        formData.set('avatar', avatar)

        dispatch(updateProfile(formData))
    }

    const onChange = e => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }
    return (
        <Fragment>
            <Header />
            <Container component="main" maxWidth="xs">
                <MetaData title={'Update Profile'} />
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <UpdateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Update Profile
                    </Typography>
                    <form className={classes.form} onSubmit={submitHandler} encType='multipart/form-data'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="fname"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    value={name}
                                    name='name'
                                    onChange={(e) => setName(e.target.value)}
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                />
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <Avatar alt='Avatar Preview' src={user.avatar.url} />
                            </Grid>

                            <Grid item xs={12} sm={10}>
                                <TextField
                                    variant="outlined"
                                    // required
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
                            Update
                            </Button>
                    </form>
                </div>
            </Container>
        </Fragment>

    )
}

export default UpdateProfile
