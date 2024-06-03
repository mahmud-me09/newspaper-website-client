import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar';

const AdminRoot = () => {
    return (
		<div className="flex gap-4 flex-col lg:flex-row">
			<AdminSideBar></AdminSideBar>
			<div className='flex-grow'><Outlet/></div>
		</div>
	);
};

export default AdminRoot;