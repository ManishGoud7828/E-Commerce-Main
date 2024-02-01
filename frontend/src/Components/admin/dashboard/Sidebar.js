import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import {
    makeStyles, Drawer, AppBar, Toolbar, Divider, IconButton, ListSubheader,
    ListItem, ListItemIcon, ListItemText, List,
} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    acc_detail: {
        display: 'block'
    },
    acc: {
        backgroundColor: '#0D2F36',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        color: '#fff',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed        
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        backgroundColor: '#0D2F36',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        backgroundColor: '#0D2F36',
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    icon_color: { color: '#fff', }
}));

const Sidebar = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    return (
        <Fragment>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <div >
                        <Link to='/'>
                            <img src='/image/logo.png' alt='Logo' />
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon className={classes.icon_color} />
                    </IconButton>
                </div>

                <Divider />
                <div>
                    <List>
                        <Link to="/dashboard">
                            <ListItem button>
                                <ListItemIcon>
                                    <DashboardIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" className={classes.icon_color} />
                            </ListItem>
                        </Link>

                        <Link to="/admin/orders">
                            <ListItem button>
                                <ListItemIcon>
                                    <ShoppingCartIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="Orders" className={classes.icon_color} />
                            </ListItem>
                        </Link>

                        <Link to="/admin/users">
                            <ListItem button>
                                <ListItemIcon>
                                    <PeopleIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="Users" className={classes.icon_color} />
                            </ListItem>
                        </Link>

                        <Link to="/admin/reviews">
                            <ListItem button>
                                <ListItemIcon>
                                    <StarOutlineIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="Reviews" className={classes.icon_color} />
                            </ListItem>
                        </Link>
                    </List>

                    <Divider />
                    <List>
                        <ListSubheader inset className={classes.icon_color} >PRODUCTS</ListSubheader>

                        <Link to="/admin/products">
                            <ListItem button>
                                <ListItemIcon>
                                    <MenuIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="All" className={classes.icon_color} />
                            </ListItem>
                        </Link>

                        <Link to="/admin/product">
                            <ListItem button>
                                <ListItemIcon>
                                    <AddCircleIcon className={classes.icon_color} />
                                </ListItemIcon>
                                <ListItemText primary="Create" className={classes.icon_color} />
                            </ListItem>
                        </Link>
                    </List>
                </div>
                <Divider />
            </Drawer>
        </Fragment>
    )
}

export default Sidebar
