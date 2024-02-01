import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../../Layouts/MetaData';
import Loader from '../../Layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from '../../../actions/productActions';
import { allOrders } from '../../../actions/orderAction';
import { allUsers } from '../../../actions/userAction';

import Sidebar from './Sidebar';
import clsx from 'clsx';
import {
    makeStyles, CssBaseline, Container, Grid, Paper, Typography
} from '@material-ui/core';
import Title from './Title';

// import Orders from './Orders';


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
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        backgroundColor: '#0D2F36',
        color: '#fff',
        textAlign: 'center',
    },
    fixedHeight: {
        height: 210,
    },
    depositContext: {
        flex: 1,
    },
    text_color: { color: '#fff', }
}));

export default function Dashboard() {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.products);
    const { orders, totalAmount, loading } = useSelector(state => state.allOrders);
    const { users } = useSelector(state => state.allUsers);

    let outOfStock = 0;
    products.forEach(prod => {
        if (prod.stock == 0) {
            outOfStock += 1;
        }
    });

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(allOrders());
        dispatch(allUsers());

    }, [dispatch])

    // material ui
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (

        <div className={classes.root}>
            <MetaData title={'Admin- Dashboard'} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                {loading ? <Loader /> : (
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Title>Products</Title>
                                    <Typography component="p" variant="h4" className={classes.depositContext}>
                                        {products && products.length}
                                    </Typography>
                                    <div>
                                        <Link className={classes.text_color} to="/admin/products">
                                            View Details
                                    </Link>
                                    </div>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Title>Orders</Title>
                                    <Typography component="p" variant="h4" className={classes.depositContext}>
                                        {orders && orders.length}
                                    </Typography>

                                    <div>
                                        <Link className={classes.text_color} to="/admin/orders">
                                            View Details
                                    </Link>
                                    </div>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Title>Users</Title>
                                    <Typography component="p" variant="h4" className={classes.depositContext}>
                                        {users && users.length}
                                    </Typography>

                                    <div>
                                        <Link className={classes.text_color} to="/admin/users">
                                            View Details
                                    </Link>
                                    </div>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4} lg={3}>
                                <Paper className={fixedHeightPaper}>
                                    <Title>Out Of Stock</Title>
                                    <Typography component="p" variant="h4" className={classes.depositContext}>
                                        {outOfStock}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.paper}>
                                    <Title>Total Amount</Title>
                                    <Typography component="p" variant="h4" className={classes.depositContext}>
                                        ${totalAmount}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                )}
            </main>
        </div>

    );
}