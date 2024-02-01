import React, { Fragment, useEffect, useState } from 'react';
import MetaData from './Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Products from './products/Products';
import Loader from './Layouts/Loader';
import { useAlert } from 'react-alert';
import Pagination from "react-js-pagination";
import { Slider } from '@material-ui/core';
import Header from './Layouts/Header';
import Banner from './Layouts/Banner';

import clsx from 'clsx';
import { makeStyles, Drawer, Container, Fab, IconButton } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    list: {
        width: 310,
        height: 'auto',
        backgroundColor: '#F5F5F5',
    },
    cards: {
        marginTop: theme.spacing(3),
    }
}));

const Home = ({ match }) => {
    // material ui
    const classes = useStyles();
    const [state, setState] = useState({
        left: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Container component="main" maxWidth="xs">
                <div className='mt-5'>
                    <Slider
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={1}
                        max={1200}
                        defaultValue={[1, 1200]}
                        // getAriaValueText={{'hi':'d'}}
                        value={price}
                        marks={[
                            {
                                value: 1, label: '$1'
                            },
                            {
                                value: 1200, label: '$1200'
                            }
                        ]}
                        onChange={(e, price) => setPrice(price)}
                    />
                </div>

                <div className='mt-5'>
                    <h4 className='mb-3'>Categories</h4>
                    <ul className='pl-0'>
                        {
                            cattegories.map(category => (
                                <li key={category}
                                    className='category_filter'
                                    style={{ listStyle: 'none', cursor: 'pointer' }}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className='mt-5 pb-5'>
                    <h4 className='mb-3'>Ratings</h4>
                    <ul className='pl-0'>
                        {
                            [5, 4, 3, 2, 1].map(stars => (
                                <li key={stars}
                                    style={{ listStyle: 'none', cursor: 'pointer' }}
                                    onClick={() => setRating(stars)}
                                >
                                    <div className="rating-outer">
                                        <div className="rating-inner"
                                            style={{
                                                width: `${stars * 20}%`
                                            }}
                                        >
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Container>

        </div>
    );
    //material ui

    let alert = useAlert();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1200]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    const cattegories = [
        'Electronics',
        'Home',
        'Laptop',
        'Cameras',
        'Accessories',
        "Headphones",
        'Foods',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor'
    ];

    // pull prod from states
    const {
        loading,
        error,
        products,
        productsCount,
        resPerPage,
        filteredProductCount
    } = useSelector(state => state.products)

    const keyword = match.params.keyword;

    useEffect(() => {
        if (error) {
            return alert.error(error);
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating));

    }, [dispatch, alert, error, currentPage, keyword, price, category, rating]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber);
    }

    let count = productsCount;
    // if there is keyword on search and after filter (handle pagination on search page)
    if (keyword) {
        count = filteredProductCount
    }

    return (
        <Fragment>
            <Header />
            {!keyword && <Banner/> }
            
            <div className="container container-fluid">
                {loading ? <Loader /> :
                    <Fragment>
                        <MetaData title={'Buy Online Best Products'} />
                        <h1 id="products_heading">Latest Products</h1>

                        <section>
                            {['left'].map((anchor) => (
                                <Fragment key={anchor}>
                                    {keyword ?
                                        <Fragment>
                                            <div className='d-flex justify-content-between'>
                                                <IconButton>
                                                    <KeyboardTabIcon fontSize="large" />
                                                </IconButton>
                                                <div>
                                                    <Fab
                                                        variant="extended"
                                                        color="secondary"
                                                        aria-label="filter"
                                                        onClick={toggleDrawer(anchor, true)}
                                                        className={classes.margin}>
                                                        <FilterListIcon className={classes.extendedIcon} />
                                                    Filter
                                                </Fab>
                                                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                                                        {list(anchor)}
                                                    </Drawer>
                                                </div>
                                            </div>

                                            <div className='row d-flex justify-content-center'>
                                                {
                                                    products && products.map(items => (
                                                        <Products key={items._id} product={items} col={3} />
                                                    ))
                                                }
                                            </div>

                                        </Fragment>
                                        : (
                                            // default home page products
                                            <div className='row d-flex justify-content-center'>
                                                {
                                                    products && products.map(items => (
                                                        <Products key={items._id} product={items} col={3} />
                                                    ))
                                                }
                                            </div>                                            
                                        )
                                    }

                                </Fragment>
                            ))}
                        </section>


                        {/* if only 4 resperpage and  2 products count in DB then it will not show pagination*/}
                        {resPerPage <= count && (
                            <div className='d-flex justify-content-center mt-5'>
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resPerPage}
                                    totalItemsCount={productsCount}
                                    onChange={setCurrentPageNo}
                                    nextPageText='Next'
                                    prevPageText='Prev'
                                    firstPageText='First'
                                    lastPageText='Last'
                                    itemClass='page-item'
                                    linkClass='page-link'
                                />
                            </div>
                        )}
                    </Fragment>
                }
            </div>
        </Fragment>
    )
}

export default Home
