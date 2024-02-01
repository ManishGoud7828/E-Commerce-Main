import React, { Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, clearError, deleteUser } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstant';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { MDBDataTable } from 'mdbreact';
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


const UsersList = ({ history }) => {
    const classes = useStyles();

    const Alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, users } = useSelector(state => state.allUsers);
    const { isDeleted } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(allUsers())

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

        if (isDeleted) {
            Alert.success("User has been deleted");
            history.push('/admin/users');
            dispatch({ type: DELETE_USER_RESET });
        }

    }, [dispatch, Alert, error, history, isDeleted])

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    }

    const setUsers = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: <div className='d-flex justify-content-around'>
                    <div>
                        <Link to={`/admin/user/${user._id}`} className='btn btn-warning py-1 px-2'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                    </div>

                    <div className='ml-1'>
                        <button
                            onClick={() => deleteUserHandler(user._id)}
                            className='btn btn-danger py-1 px-2 ml-2'>
                            <i className='fa fa-trash'></i>
                        </button>
                    </div>
                </div>
            })
        });
        return data;
    }

    return (
        <div className={classes.root}>
            <MetaData title={'All Users'} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <h1 className='mb-5 mt-2'>All Users</h1>
                    {loading ? <Loader /> : (
                        <MDBDataTable
                            data={setUsers()}
                            className='py-3'
                            bordered
                            striped
                            hover
                            responsive
                        />
                    )}
                </Container>
            </main>
        </div>
    )
}

export default UsersList
