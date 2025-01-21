/* eslint-disable no-unused-vars */
import React from 'react';
import Video from './Video';
import TourPackages from './TourPackages';
import Booking from './Booking';
import ContractMe from './ContractMe';

const Home = () => {
    return (
        <div>
            <Video></Video>
            <TourPackages></TourPackages>
            <ContractMe></ContractMe>
            <Booking></Booking>
        </div>
    );
};

export default Home;