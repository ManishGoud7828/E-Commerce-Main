import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload //action.payload contain product

            //i.product is basically id of product
            const isItemExist = state.cartItems.find(i => i.product === item.product)
            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
                }
            }
            else {
                // if item is not in cart, simply return whatever items in cart is their already
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case REMOVE_CART_ITEM:
            return {
                ...state,
                // filtering out that product user want to delete
                cartItems: state.cartItems.filter(i => i.product !== action.payload)
            }
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }

        default:
            return state;
    }
}