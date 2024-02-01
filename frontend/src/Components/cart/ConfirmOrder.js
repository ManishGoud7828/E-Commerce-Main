import React, { Fragment } from 'react';
import MetaData from '../Layouts/MetaData';
import { useSelector } from 'react-redux';
import CheckOutSteps from './CheckOutSteps';
import { Link } from 'react-router-dom';
import Header from '../Layouts/Header';

const ConfirmOrder = ({ history }) => {
    const { user } = useSelector(state => state.auth);
    const { shippingInfo, cartItems } = useSelector(state => state.cart);

    //calculate order price
    const itemPrice = cartItems.reduce((acc, items) => acc + items.price * items.quantity, 0);

    // if item price is < 200 then add shipping price 25
    const shippingPrice = itemPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemPrice).toFixed(2));
    const totalPrice = (itemPrice + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemPrice: itemPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }
        // adding it to sessionStorage because when user put new order after payment
        // we can pull data from sessionStorage so we don't need to calculate this Prices again
        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        history.push('/payment');
    }

    return (
        <Fragment>
             <Header />
             <div className="container container-fluid">
            <MetaData title={'Confirm Order'} />
            <CheckOutSteps shipping confirm/>
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>
                    {cartItems.map(item => (
                        <Fragment>
                            <hr />
                            <div className="cart-item my-1" key={item.product}>
                                <div className="row">
                                    <div className="col-3 col-lg-2 col-md-3">
                                        <img src={item.image} alt={item.name} height="60" width="70" />
                                    </div>

                                    <div className="col-5 col-lg-5 col-md-5">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>

                                    <div className="col-4 col-lg-5 col-md-4">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}

                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">${itemPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">${taxPrice}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>

                        <hr />
                        <button id="checkout_btn"
                            onClick={processToPayment}
                            className="btn btn-primary btn-block">Proceed to Payment</button>
                    </div>
                </div>

            </div>
            </div>
        </Fragment>
    )
}

export default ConfirmOrder
