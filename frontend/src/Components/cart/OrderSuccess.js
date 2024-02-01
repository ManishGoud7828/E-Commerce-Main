import React, { Fragment } from 'react';
import MetaData from '../Layouts/MetaData';
import { Link } from 'react-router-dom';
import Header from '../Layouts/Header';

const OrderSuccess = () => {
    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                <MetaData title={'Order Success'} />
                <div className="row justify-content-center">
                    <div className="col-6 mt-5 text-center">
                        <img className="my-5 img-fluid d-block mx-auto"
                            src='/image/confirmation.png'
                            alt="Order Success"
                            width="200"
                            height="200" />

                        <h2>Your Order has been placed successfully.</h2>

                        <Link to="/orders/me">Go to Orders</Link>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default OrderSuccess
