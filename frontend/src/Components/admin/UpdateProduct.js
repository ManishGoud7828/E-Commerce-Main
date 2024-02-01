import React, { Fragment, useEffect, useState } from 'react';
import MetaData from '../Layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, getProductDetails, clearError } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
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
        paddingBottom: theme.spacing(12),
    },
}));


const UpdateProduct = ({ match, history }) => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
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

    const Alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error: updateError, isUpdated } = useSelector(state => state.product);
    const { error, product } = useSelector(state => state.productDetails);

    const productID = match.params.id;

    useEffect(() => {
        // if product id is changed, then dispatch productDetails for that coresspond product id
        if (product && productID !== product._id) {
            dispatch(getProductDetails(productID));
        }
        else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSeller(product.seller);
            setStock(product.stock);
            setOldImages(product.images);
        }

        if (error) {
            Alert.error(error);
            dispatch(clearError());
        }
        if (updateError) {
            Alert.error(updateError);
            dispatch(clearError());
        }

        if (isUpdated) {
            history.push('/admin/products');
            Alert.success('Product has been updated successfully');
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }

    }, [dispatch, Alert, error, isUpdated, history, updateError, product, productID])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name)
        formData.set('price', price)
        formData.set('description', description)
        formData.set('category', category)
        formData.set('stock', stock)
        formData.set('seller', seller)

        // for multiple images
        images.forEach(image => {
            formData.append('images', image)
        })

        dispatch(updateProduct(product._id, formData))
    }

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        setOldImages([]);

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    // when second time user upload image, it spread oldArray and new images added to oldArray
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <div className={classes.root}>
            <MetaData title={'Update Product'} />
            <CssBaseline />
            <Sidebar />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Fragment>
                        <div className="wrapper mb-5 mt-2">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Update Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="8" ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        className="form-control"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        id="category_field">
                                        {categories.map(category => (
                                            <option key={category} value={category}> {category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <input
                                        type="text"
                                        id="seller_field"
                                        className="form-control"
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            multiple
                                            onChange={onChange}
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                    </label>
                                    </div>
                                    {oldImages && oldImages.map(img => (
                                        <img
                                            src={img.url}
                                            key={img}
                                            alt={img.url}
                                            width='55'
                                            height='55'
                                            className='mt-3 mr-2'
                                        />
                                    ))}

                                    {imagesPreview.map(img => (
                                        <img
                                            src={img}
                                            key={img}
                                            alt='Images Preview'
                                            width='55'
                                            height='55'
                                            className='mt-3 mr-2'
                                        />
                                    ))}
                                </div>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    UPDATE
                            </button>

                            </form>
                        </div>
                    </Fragment>
                </Container>
            </main>
        </div>
    )
}

export default UpdateProduct
