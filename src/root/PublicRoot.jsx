import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicRoot = () => {
    return (
        <>
            <Outlet></Outlet>
        </>
    );
};

export default PublicRoot;