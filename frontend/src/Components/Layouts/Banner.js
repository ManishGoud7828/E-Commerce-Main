import React from 'react';
import { Carousel } from 'react-bootstrap';

const Banner = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img
                    className="d-block w-100 banner_img"
                    src="/image/banner1.jpg"
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100 banner_img"
                    src="/image/banner2.jpg"
                    alt="Second slide"
                />
            </Carousel.Item>
        </Carousel>
    )
}

export default Banner
