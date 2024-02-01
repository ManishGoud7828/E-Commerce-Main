import React, { Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearError } from '../../actions/orderAction';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { MDBDataTable } from 'mdbreact';
import Header from '../Layouts/Header';

const ListOrders = () => {
    const Alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.myOrders)

    useEffect(() => {
        dispatch(myOrders())

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

    }, [dispatch, Alert, error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Num Of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc',
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
                actions:
                    <Link to={`/order/${order._id}`} className='btn btn-warning'>
                        <i className='fa fa-eye'></i>
                    </Link>
            })
        });
        return data;
    }

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                <MetaData title={'My Orders'} />
                <h1 className='mt-5'>Your Orders</h1>
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
            </div>
        </Fragment>
    )
}

export default ListOrders
