import React, { Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { allOrders, deleteOrder, clearError } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstant';
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

const OrderList = ({ history }) => {
    const classes = useStyles();

    const Alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(allOrders())

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

        if (isDeleted) {
            Alert.success("Order has been deleted");
            history.push('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }

    }, [dispatch, Alert, error, isDeleted, history])

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'No Of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ],
            rows: []
        };

        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes("Delivered")
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: <div className='d-flex justify-content-around'>
                    <div>
                        <Link to={`/admin/order/${order._id}`} className='btn btn-warning'>
                            <i className='fa fa-eye'></i>
                        </Link>
                    </div>

                    <div className='ml-1'>
                        <button
                            className='btn btn-danger'
                            onClick={() => deleteOrderHandler(order._id)}>
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
            <MetaData title={'All Orders'} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <h1 className='mb-5 mt-2'>All Orders</h1>
                    {loading ? <Loader /> : (
                        <MDBDataTable
                            data={setOrders()}
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

export default OrderList
