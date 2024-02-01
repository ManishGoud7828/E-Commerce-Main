import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ product, col }) => {
    return (
        <div className={`custom_card col-6 col-md-4 col-lg-${col} my-3`}>
            <div className="card rounded" >
                <img
                    className="card-img-top "
                    src={product.images[0].url}
                    alt={product.name}
                />
                <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title">
                        <Link to={`/product/${product._id}`} className='h5'>{product.name}</Link>
                    </h5>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner"
                                style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    </div>
                    <p className="card-text">${product.price}</p>
                    <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
                </div>
            </div>
        </div>
    )
}

export default Products
