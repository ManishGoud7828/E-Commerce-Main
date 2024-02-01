import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../Layouts/MetaData';
import ListReviews from '../review/ListReviews';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, clearError, newReview } from '../../actions/productActions';
import Loader from '../Layouts/Loader';
import { useAlert } from 'react-alert';
import { Carousel } from 'react-bootstrap';
import { addItemsToCart } from '../../actions/cartAction';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import Header from '../Layouts/Header';

const ProductDetails = ({ match }) => {
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const alert = useAlert();
    const { loading, error, product } = useSelector(state => state.productDetails);
    const { user } = useSelector(state => state.auth);
    const { error: reviewError, success } = useSelector(state => state.newReview);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))

        if (error) {
            alert.error(error)
            dispatch(clearError());
        }
        if (reviewError) {
            alert.error(reviewError)
            dispatch(clearError());
        }

        if (success) {
            alert.success("Review Posted Successfully!")
            dispatch({ type: NEW_REVIEW_RESET })
        }

    }, [dispatch, alert, error, match.params.id, reviewError, success])//if change any of the dependencies we have to load data

    const increaseQuantity = () => {
        const count = document.querySelector('.count');
        if (count.valueAsNumber >= product.stock) return;
        const qauntity = count.valueAsNumber + 1;
        setQty(qauntity);
    }

    const decreaseQuantity = () => {
        const count = document.querySelector('.count');
        if (count.valueAsNumber <= 1) return;
        const qauntity = count.valueAsNumber - 1;
        setQty(qauntity);
    }

    const addToCart = () => {
        dispatch(addItemsToCart(match.params.id, qty));
        alert.success('Items Added To Cart')
    }

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            // setting starValue as attribut
            star.starValue = index + 1;
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('darkPink');
                        setRating(this.starValue);
                    } else {
                        star.classList.remove('darkPink')
                    }
                }

                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('lightPink')
                    } else {
                        star.classList.remove('lightPink')
                    }
                }

                if (e.type === 'mouseout') {
                    star.classList.remove('lightPink')
                }
            })
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();

        // set first parameter in formData.set() as you have defined in model and controller on backend        
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);

        dispatch(newReview(formData));
    }

    return (
        <Fragment>
            <Header />
            <div className="container container-fluid">
                {loading ? <Loader /> :
                    (
                        <Fragment>
                            <MetaData title={product.name} />

                            <div className="row f-flex justify-content-around">
                                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                    <Carousel pause='hover'>
                                        {product.images && product.images.map(img => (
                                            <Carousel.Item key={img.public_id}>
                                                <img className='d-block w-100' src={img.url} alt={product.name} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>

                                <div className="col-12 col-lg-5 mt-5">
                                    <h3>{product.name}</h3>
                                    <p id="product_id">Product # {product._id}</p>

                                    <hr />

                                    <div className="rating-outer">
                                        <div className="rating-inner"
                                            style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                    </div>
                                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                                    <hr />

                                    <p id="product_price">${product.price}</p>
                                    <div className="stockCounter d-inline">
                                        <span className="btn btn-danger minus" onClick={decreaseQuantity}>-</span>

                                        <input type="number" className="form-control count d-inline" value={qty} readOnly />

                                        <span className="btn btn-primary plus" onClick={increaseQuantity}>+</span>
                                    </div>
                                    <button type="button"
                                        id="cart_btn"
                                        onClick={addToCart}
                                        disabled={product.stock === 0}
                                        className="btn btn-primary d-inline ml-4">Add to Cart</button>

                                    <hr />

                                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</span></p>

                                    <hr />

                                    <h4 className="mt-2">Description:</h4>
                                    <p>{product.description}</p>
                                    <hr />
                                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                                    {user ? <button id="review_btn"
                                        type="button"
                                        className="btn btn-primary mt-4"
                                        data-toggle="modal"
                                        data-target="#ratingModal"
                                        onClick={setUserRatings}>
                                        Submit Your Review
                                </button> :
                                        <div className='alert alert-danger mt-5' type='alert'>Login To Post Your Review</div>
                                    }

                                    <div className="row mt-2 mb-5">
                                        <div className="rating w-50">

                                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">

                                                            <ul className="stars" >
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                            </ul>

                                                            <textarea
                                                                name="review"
                                                                id="review"
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                className="form-control mt-3">

                                                            </textarea>

                                                            <button
                                                                className="btn my-3 float-right review-btn px-4 text-white"
                                                                data-dismiss="modal"
                                                                onClick={reviewHandler}
                                                                aria-label="Close">Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {product.reviews && product.reviews.length > 0 && (
                                <ListReviews reviews={product.reviews} />
                            )}
                        </Fragment>
                    )
                }
            </div>
        </Fragment>
    )
}

export default ProductDetails
