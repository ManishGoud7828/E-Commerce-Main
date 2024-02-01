// reduce use to combine/reduce multiple value to single.
import React, { Fragment } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Link } from 'react-router-dom'
import Header from '../Layouts/Header';

const Cart = ({ history }) => {
    const dispatch = useDispatch();

    const removeCartHandler = (id) => {
        dispatch(removeItemsFromCart(id))
    }

    const { cartItems } = useSelector(state => state.cart);

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty < 1) return;
        dispatch(addItemsToCart(id, newQty));
    }

    const checkOutHandler = () => {
        // if user is not login, login him/her and then redirect to shipping page
        // check login component [redirect]
        history.push('/login?redirect=shipping')
    }

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                {cartItems.length === 0 ?
                    <h2 className='mt-5'>Your Cart Is Empty</h2> :
                    (
                        <Fragment>
                            <MetaData title={'Your Cart'} />
                            <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>

                            <div className="row d-flex justify-content-between">
                                <div className="col-12 col-lg-8 col-md-12">
                                    {cartItems.map(item => (
                                        <Fragment>
                                            <hr />
                                            <div className="cart-item" key={item}>
                                                <div className="row">
                                                    <div className="col-12 col-md-4 col-lg-3">
                                                        <img src={item.image} alt={item.name} height="90" width="115" />
                                                    </div>

                                                    <div className="col-12 col-md-4 col-lg-4 mt-4 mt-lg-0">
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </div>

                                                    <div className="col-12 col-md-4 col-lg-2 mt-4 mt-lg-0">
                                                        <p id="card_item_price">${item.price}</p>
                                                    </div>


                                                    <div className='col-12 col-md-12 col-lg-3 d-flex justify-content-between'>

                                                        <div className="mt-4 mt-lg-0">
                                                            <div className="stockCounter d-inline">
                                                                <span
                                                                    className="btn btn-danger minus"
                                                                    onClick={() => decreaseQuantity(item.product, item.quantity)}
                                                                >-</span>
                                                                <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />
                                                                <span
                                                                    className="btn btn-primary plus"
                                                                    onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}
                                                                >+</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 mt-lg-0">
                                                            <i
                                                                id="delete_cart_item"
                                                                onClick={() => removeCartHandler(item.product)}
                                                                className="fa fa-trash btn btn-danger">
                                                            </i>
                                                        </div>
                                                    </div>



                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}

                                    <hr />
                                </div>

                                <div className="col-12 col-md-12 col-lg-3 my-4">
                                    <div id="order_summary">
                                        <h4>Order Summary</h4>
                                        <hr />
                                        <p>Subtotal:
                                         <span className="order-summary-values">
                                                {cartItems.reduce((acc, items) => (acc + Number(items.quantity)), 0)}
                                             (Units)</span></p>
                                        <p>Est. total:
                                         <span className="order-summary-values">
                                                ${cartItems.reduce((acc, items) => (acc + Number(items.price) * Number(items.quantity)), 0).toFixed(2)}
                                            </span></p>

                                        <hr />
                                        <button id="checkout_btn"
                                            onClick={checkOutHandler}
                                            className="btn btn-primary btn-block">Check out</button>
                                    </div>
                                </div>
                            </div>

                        </Fragment>
                    )}
            </div>
        </Fragment>
    )
}

export default Cart
