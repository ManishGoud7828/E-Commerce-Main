import React, { Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, clearError } from '../../actions/orderAction';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Header from '../Layouts/Header';

const OrderDetails = ({ match }) => {
    const Alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, order = {} } = useSelector(state => state.orderDetails);
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;


    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, 
    ${shippingInfo.postalCode}, ${shippingInfo.country}`;

    useEffect(() => {
        dispatch(getOrderDetails(match.params.id))

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

    }, [dispatch, Alert, error, match.params.id])

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                <MetaData title={'Order Details'} />
                {loading ? <Loader /> : (
                    <Fragment>
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-9 mt-5 order-details">

                                <h1 className="my-5 orderID">Order #{order._id}</h1>

                                <h4 className="mb-4">Shipping Info</h4>
                                <p><b>Name:</b> {user && user.name}</p>
                                <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                                <p><b>Amount:</b> ${totalPrice}</p>

                                <hr />

                                <h4 className="my-4">Payment</h4>
                                <p className={isPaid ? 'greenColor' : 'redColor'} >
                                    <b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>


                                <h4 className="my-4">Order Status:</h4>
                                <p className={orderStatus && String(orderStatus).includes("Delivered") ? 'greenColor' : 'redColor'} >
                                    <b>{orderStatus}</b></p>

                                <h4 className="my-4">Order Items:</h4>

                                <hr />
                                <div className="cart-item my-1">
                                    {orderItems && orderItems.map(item => (
                                        <div key={item.product} className="row my-5">
                                            <div className="col-3 col-md-3 col-lg-3">
                                                <img src={item.image} alt={item.name} height="45" width="65" />
                                            </div>

                                            <div className="col-9 col-md-4 col-lg-4">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>

                                            <div className='col-12 col-md-5 col-lg-5 d-flex justify-content-between'>

                                                <div className=" mt-4 mt-lg-0 mt-md-0">
                                                    <p>${item.price}</p>
                                                </div>

                                                <div className=" mt-4 mt-lg-0 mt-md-0">
                                                    <p><span className='text-center'>{item.quantity}</span>Piece(s)</p>
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                                <hr />
                            </div>
                        </div>

                    </Fragment>
                )}
            </div>
        </Fragment>
    )
}

export default OrderDetails
