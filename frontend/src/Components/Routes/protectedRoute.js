import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// if user is logged out and try to access resource which required login, we implement protedtedRoutes.
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.auth);
    return (
        <Fragment>
            {loading === false && (
                <Route
                    {...rest} //exact,path etc
                    render={(props) => {
                        if (isAuthenticated === false) {
                            return <Redirect to='/login' />
                        }
                        if (isAdmin === true && user.role !== 'admin') {
                            return <Redirect to='/' />
                        }
                        return <Component {...props} />
                    }}
                />
            )}
        </Fragment>
    )
}

export default ProtectedRoute
