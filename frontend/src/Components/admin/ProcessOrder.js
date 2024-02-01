import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, updateOrder, clearError } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstant';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
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


const ProcessOrder = ({ match }) => {
    const classes = useStyles();

    const [status, setStatus] = useState('');

    const Alert = useAlert();
    const dispatch = useDispatch();
    const { order = {}, loading } = useSelector(state => state.orderDetails);
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;
    const { isUpdated, error } = useSelector(state => state.order);

    const orderID = match.params.id;

    useEffect(() => {
        dispatch(getOrderDetails(orderID));
        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

        if (isUpdated) {
            Alert.success('Order has been updated successfully');
            dispatch({ type: UPDATE_ORDER_RESET })
        }

    }, [dispatch, Alert, error, isUpdated, orderID])

    const updateOrderHandler = (id) => {
        const formData = new FormData();
        formData.set('status', status)
        dispatch(updateOrder(id, formData))
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city},
     ${shippingInfo.postalCode}, ${shippingInfo.country}`;

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

    return (

        <div className={classes.root}>
            <MetaData title={`Process Order# ${order && order._id}`} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {loading ? <Loader /> : (
                        <Fragment>
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">

                                    <h2 className="mb-5 mt-2">Order # ${order._id}</h2>

                                    <h4 className="mb-4">Shipping Info</h4>
                                    <p><b>Name:</b> {user && user.name}</p>
                                    <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                    <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                                    <p><b>Amount:</b> ${totalPrice}</p>

                                    <hr />

                                    <h4 className="my-4">Payment</h4>
                                    <p className={isPaid ? 'greenColor' : 'redColor'} >
                                        <b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>

                                    <h4 className="my-4">Stripe ID</h4>
                                    <p><b>{paymentInfo && paymentInfo.id}</b></p>

                                    <h4 className="my-4">Order Status:</h4>
                                    <p className={orderStatus && String(orderStatus).includes("Delivered") ? 'greenColor' : 'redColor'} >
                                        <b>{orderStatus}</b></p>


                                    <h4 className="my-4">Order Items:</h4>

                                    <hr />
                                    <div className="cart-item my-1">
                                        {orderItems && orderItems.map(item => (
                                            <div key={item.product} className="row my-5">
                                                <div className="col-4 col-lg-2">
                                                    <img src={item.image} alt={item.name} height="45" width="65" />
                                                </div>

                                                <div className="col-5 col-lg-5">
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </div>


                                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                    <p>${item.price}</p>
                                                </div>

                                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                    <p>{item.quantity} Piece(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </div>

                                <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-block"
                                        onClick={() => updateOrderHandler(order._id)}>
                                        Update Status
                                </button>
                                </div>

                            </div>
                        </Fragment>
                    )}
                </Container>
            </main>
        </div>
    )
}

export default ProcessOrder