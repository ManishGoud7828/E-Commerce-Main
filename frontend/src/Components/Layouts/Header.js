import React from 'react';
import { Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import Search from './Search';
import '../../App.css';

import {
    makeStyles, AppBar, Toolbar, IconButton, Avatar, Badge, Box, Menu, MenuItem, Button
} from '@material-ui/core';

import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import TocIcon from '@material-ui/icons/Toc';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
    appBar: { background: '#0D2F36' },
    cartBtn: { color: '#fff', margin: '6px 15px 0 0' },
    login_btn: { height: '40px', width: '90px', margin: '6px 9px 0 9px' },
    grow: { flexGrow: 1, },
    logo: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);

    const logoutHandler = () => {
        dispatch(logout());
        alert.success("Logged Out Successfully");
    }

    // ------material ui --------
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {user && user.role === 'admin' && (
                <MenuItem onClick={handleMenuClose}>
                    <Link className='dropdown-item' to='/dashboard'>Dashboard</Link>
                </MenuItem>
            )}

            <MenuItem onClick={handleMenuClose}>
                <Link className='dropdown-item' to='/orders/me'>Orders</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Link className='dropdown-item' to='/me'>Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <Link className='dropdown-item text-danger' to='/' onClick={logoutHandler}>Logout</Link>
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>
                <IconButton >
                    <HomeIcon />
                </IconButton>
                <Link className='dropdown-item' to='/'>Home</Link>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
                <IconButton aria-label="show add to cart">
                    <Badge badgeContent={cartItems.length} color="secondary">
                        <AddShoppingCartIcon />
                    </Badge>
                </IconButton>
                <Link className='dropdown-item' to='/cart'>
                    Cart
                </Link>
            </MenuItem>

            {user && user.role === 'admin' && (
                <MenuItem onClick={handleMenuClose}>
                    <IconButton>
                        <DashboardIcon />
                    </IconButton>
                    <Link className='dropdown-item' to='/dashboard'>Dashboard</Link>
                </MenuItem>
            )}

            <MenuItem onClick={handleMenuClose}>
                <IconButton>
                    <TocIcon />
                </IconButton>
                <Link className='dropdown-item' to='/orders/me'>Orders</Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <IconButton>
                    <AccountCircle />
                </IconButton>
                <Link className='dropdown-item' to='/me'>Profile</Link>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
                <IconButton>
                    <ExitToAppIcon />
                </IconButton>
                <Link className='dropdown-item text-danger' to='/' onClick={logoutHandler}>Logout</Link>
            </MenuItem>

        </Menu>
    );
    // ------material ui --------
    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <div className={classes.logo}>
                        <Link to='/'>
                            <img src='/image/logo.png' width='250' height='60' alt='Logo' />
                        </Link>
                    </div>

                    <Route render={({ history }) => <Search history={history} />} />

                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <Box>
                            <Link to='/cart' style={{ textDecoration: 'none' }}>
                                <IconButton aria-label="show items number" className={classes.cartBtn}>
                                    <Badge badgeContent={cartItems.length} color="secondary">
                                        <AddShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </Link>
                        </Box>

                        {user ? (
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <Avatar>
                                    <img src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className='avatar'
                                    />
                                </Avatar>
                            </IconButton>
                        )
                            : !loading &&
                            <Link to='/login' style={{ textDecoration: 'none' }}>
                                <Button className={classes.login_btn} variant="contained" color="secondary">Login</Button>
                            </Link>
                        }
                    </div>
                    <div className={classes.sectionMobile}>
                        {user ? (
                            <IconButton
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        )
                            : !loading &&
                            <Link to='/login' style={{ textDecoration: 'none' }}>
                                <Button className={classes.login_btn} variant="contained" color="secondary">Login</Button>
                            </Link>
                        }
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}
export default Header