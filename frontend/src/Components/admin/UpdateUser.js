import React, { useState, Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, clearError, getUserDetails } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_USER_RESET } from '../../constants/userConstant';
import Sidebar from './dashboard/Sidebar';

import { makeStyles, CssBaseline, Container, } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(12),
    },
}));


const UpdateUser = ({ match, history }) => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const dispatch = useDispatch();
    const alert = useAlert();

    const { user } = useSelector(state => state.userDetails);
    const { error, isUpdated } = useSelector(state => state.user);
    const userID = match.params.id;

    useEffect(() => {
        if (user && user._id !== userID) {
            dispatch(getUserDetails(userID))

        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (isUpdated) {
            alert.success('User Has Been Updated!')

            history.push('/admin/users')

            dispatch({
                type: UPDATE_USER_RESET
            })
        }
    }, [dispatch, history, alert, error, isUpdated, user._id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name)
        formData.set('email', email)
        formData.set('role', role)

        dispatch(updateUser(user._id, formData))
    }
    return (
        <div className={classes.root}>
            <MetaData title={`Update User - Admin`} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <div className="row wrapper mt-0 mb-0">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mt-2 mb-5">Update User</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        name='name'
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        name='email'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>

                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>

                                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                            </form>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default UpdateUser
