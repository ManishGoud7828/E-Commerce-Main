import React from 'react';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    text_color: { color: '#fff', }
}));

export default function Title(props) {
    const classes = useStyles();
    return (
        <Typography component="h2" variant="h6" className={classes.text_color} gutterBottom>
            {props.children}
        </Typography>
    );
}

Title.propTypes = {
    children: PropTypes.node,
};