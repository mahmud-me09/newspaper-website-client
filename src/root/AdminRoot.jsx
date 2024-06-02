import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminRoot = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default AdminRoot;