import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, deleteReview, clearError } from '../../actions/productActions';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
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
        paddingBottom: theme.spacing(4),
    },
}));


const ProductReviews = () => {
    const classes = useStyles();

    const Alert = useAlert();
    const dispatch = useDispatch();
    const { error, reviews } = useSelector(state => state.productReviews);
    const { isDeleted } = useSelector(state => state.review);

    const [productId, setProductId] = useState('');

    useEffect(() => {

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }

        if (productId !== '') {
            dispatch(getProductReviews(productId));
        }

        if (isDeleted) {
            Alert.success("Review has been deleted");
            dispatch({ type: DELETE_REVIEW_RESET });
        }

    }, [dispatch, Alert, error, isDeleted])

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getProductReviews(productId));
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ],
            rows: []
        };

        reviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions:
                    <button
                        onClick={() => deleteReviewHandler(review._id)}
                        className='btn btn-danger py-1 px-2 ml-2'>
                        <i className='fa fa-trash'></i>
                    </button>
            })
        });
        return data;
    }
    return (
        <div className={classes.root}>
            <MetaData title={'Product Reviews'} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="productId_field">Enter Product ID</label>
                                        <input
                                            type="text"
                                            id="productId_field"
                                            className="form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
								</button>
                                </ form>
                            </div>
                        </div>
                        {reviews && reviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className='py-3'
                                bordered
                                striped
                                hover
                                responsive
                            />
                        ) :
                            <p className='mt-5 text-center'>No Review Found</p>
                        }
                    </Fragment>
                </Container>
            </main>
        </div>

    )
}

export default ProductReviews
