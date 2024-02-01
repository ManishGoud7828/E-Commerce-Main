import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Footer from './Components/Layouts/Footer';
import Home from './Components/Home';
import ProductDetails from './Components/products/ProductDetails';


// import carts
import Cart from './Components/cart/Cart';
import Shipping from './Components/cart/ShippingInfo';
import ConfirmOrder from './Components/cart/ConfirmOrder';
import Payment from './Components/cart/Payment';
import OrderSuccess from './Components/cart/OrderSuccess';

// import orders
import ListOrders from './Components/order/ListOrders';
import OrderDetails from './Components/order/OrderDetails';

// import Auth or User
import Login from './Components/user/Login';
import Register from './Components/user/Register';
import Profile from './Components/user/Profile';
import UpdateProfile from './Components/user/UpdateProfile';
import UpdatePassword from './Components/user/UpdatePassword';
import ForgotPassword from './Components/user/ForgotPassword';
import NewPassword from './Components/user/NewPassword';

// imports admin
import Dashboard from './Components/admin/dashboard/Dashboard';
import ProductList from './Components/admin/ProductList';
import NewProduct from './Components/admin/NewProduct';
import UpdateProduct from './Components/admin/UpdateProduct';
import OrderList from './Components/admin/OrderList';
import ProcessOrder from './Components/admin/ProcessOrder';
import UsersList from './Components/admin/UsersList';
import UpdateUser from './Components/admin/UpdateUser';
import ProductReviews from './Components/admin/ProductReviews';


import store from './store';
import { load_user } from './actions/userAction';
import ProtectedRoute from './Components/Routes/protectedRoute';

// payment
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


function App() {
  const { user, loading, isAuthenticated } = useSelector(state => state.auth);

  const [stripeApiKey, setStripeApiKey] = useState('');

  // load currently logged user instantly when user refresh the page
  useEffect(() => {
    store.dispatch(load_user());

    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey();

  }, [])

  return (
    <Router>
      <div className="App">
        <Route path="/" component={Home} exact />

        <Route path="/search/:keyword" component={Home} />

        <Route path="/product/:id" component={ProductDetails} exact />

        <Route path="/cart" component={Cart} exact />
        <ProtectedRoute path="/shipping" component={Shipping} />
        <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
        <ProtectedRoute path="/success" component={OrderSuccess} />

        {stripeApiKey &&
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute path="/payment" component={Payment} />
          </Elements>
        }

        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/password/forgot' component={ForgotPassword} exact />
        <Route path='/password/reset/:token' component={NewPassword} exact />
        <ProtectedRoute path='/me' component={Profile} exact />
        <ProtectedRoute path='/me/update' component={UpdateProfile} exact />
        <ProtectedRoute path='/password/update' component={UpdatePassword} exact />
        <ProtectedRoute path='/orders/me' component={ListOrders} exact />
        {/* <ProtectedRoute path='/order/:id' component={OrderDetails} exact /> */}


        <ProtectedRoute path='/dashboard' isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path='/admin/products' isAdmin={true} component={ProductList} exact />
        <ProtectedRoute path='/admin/product' isAdmin={true} component={NewProduct} exact />
        <ProtectedRoute path='/admin/product/:id' isAdmin={true} component={UpdateProduct} exact />
        <ProtectedRoute path='/admin/orders' isAdmin={true} component={OrderList} exact />
        <ProtectedRoute path='/admin/order/:id' isAdmin={true} component={ProcessOrder} exact />
        <ProtectedRoute path='/admin/users' isAdmin={true} component={UsersList} exact />
        <ProtectedRoute path='/admin/user/:id' isAdmin={true} component={UpdateUser} exact />
        <ProtectedRoute path='/admin/reviews' isAdmin={true} component={ProductReviews} exact />
        
        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}

      </div>
    </Router>
  );
}

export default App;
