import React, { Fragment, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import { useSelector, useDispatch } from 'react-redux';
import CheckOutSteps from './CheckOutSteps';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useAlert } from 'react-alert'
import axios from 'axios';
import { clearError, createOrder } from '../../actions/orderAction';
import Header from '../Layouts/Header';
import {
    Avatar, Button, CssBaseline, InputLabel, Grid, Typography, Container, makeStyles
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const options = {
    style: {
        base: {
            fontSize: '16px'
        },
        invalid: {
            color: '#9e2146'
        }
    }
}


const Payment = ({ history }) => {
    const classes = useStyles();

    const { user } = useSelector(state => state.auth);
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { error } = useSelector(state => state.newOrder);

    const dispatch = useDispatch();
    const Alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (error) {
            Alert.error(error)
            dispatch(clearError())
        }
    }, [dispatch, Alert, error])

    const order = {
        orderItems: cartItems,
        shippingInfo
    }

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    // if order info exist then set further details of order
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
    }

    const paymentData = {
        // we have to send amount in cent thats why *100
        amount: Math.round(orderInfo.totalPrice * 100)
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;
        let res;
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            res = await axios.post('/api/v1/payment/process', paymentData, config)

            const clientSecret = res.data.client_secret;
            // stripe and element need to be exist
            if (!stripe || !elements) {
                return;
            }
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                }
            });
            if (result.error) {
                Alert.error(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            }
            else {
                // the payment processed or not
                if (result.paymentIntent.status === 'succeeded') {

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    dispatch(createOrder(order))
                    console.log('order==>', order);

                    history.push('/success')
                }
                else {
                    Alert.error("There is some issue while payment processing");
                }
            }
        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;
            Alert.error(error.response.data.errMessage);
        }
    }

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                <CheckOutSteps shipping confirm payment />
                <Container component="main" maxWidth="xs">
                    <MetaData title={'Payment'} />
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <InfoIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Card Info
                    </Typography>
                        <form className={classes.form} onSubmit={submitHandler}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <InputLabel shrink={true}>Card Number</InputLabel>
                                    <CardNumberElement
                                        type="text"
                                        id="card_num_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel shrink={true}>Card Expiry</InputLabel>
                                    <CardExpiryElement
                                        type="text"
                                        id="card_exp_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <InputLabel shrink={true}>Card CVC</InputLabel>
                                    <CardCvcElement
                                        type="text"
                                        id="card_cvc_field"
                                        className="form-control"
                                        options={options}
                                    />
                                </Grid>

                            </Grid>
                            <Button
                                type="submit"
                                id="pay_btn"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                Pay {`- $${orderInfo.totalPrice}`}
                            </Button>
                        </form>
                    </div>
                </Container>
            </div>
        </Fragment>
    )
}

export default Payment
