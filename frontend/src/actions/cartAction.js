import axios from 'axios';
import { ADD_TO_CART, REMOVE_CART_ITEM,SAVE_SHIPPING_INFO } from '../constants/cartConstants';

export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    // searchProduct with id
    const { data } = await axios.get(`/api/v1/product/${id}`)

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    })

    // save items from cart to localStorage, to prevent from disappea from cart after refreshing page
    // convert cartItems from JSON to String
    // getState will return whatever in current state
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemsFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))
}