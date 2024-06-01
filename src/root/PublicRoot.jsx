import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DateToday from '../components/DateToday';
import Footer from '../components/Footer';

const PublicRoot = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default PublicRoot;