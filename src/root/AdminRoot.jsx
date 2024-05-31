import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminRoot = () => {
    return (
        <div>
            This is admin router
            <Outlet></Outlet>
        </div>
    );
};

export default AdminRoot;