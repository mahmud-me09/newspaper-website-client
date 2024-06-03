import React, { useState } from 'react';

const AllUsersPage = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const handleMakeAdmin = (e)=>{
        setIsAdmin(true)
    }
    return (
		<div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
			<h2 className="mb-4 text-2xl font-semibold leading-tight">Users</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full text-xs">
					<colgroup>
						<col />
						<col />
						<col className="w-24" />
					</colgroup>
					<thead className="dark:bg-gray-300">
						<tr className="text-left">
							<th className="p-3">Profile Picture & Name</th>
							
							<th className="p-3">Email</th>
							<th className="p-3">Make Admin</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
							<td className="p-3">
								<div className="flex items-center gap-3">
									<div className="avatar">
										<div className="mask mask-squircle w-12 h-12">
											<img
												src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
												alt="Avatar Tailwind CSS Component"
											/>
										</div>
									</div>
									<div>
										<div className="font-bold">
											Hart Hagerty
										</div>
									</div>
								</div>
							</td>
							<td className="p-3">
								<p>mahmud@gmail.com</p>
							</td>
							
							<td className="p-3 text-right">
								<div className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">
									{isAdmin? <p className='text-green-400'>Admin</p>:<button className='btn' onClick={handleMakeAdmin}>Make Admin</button>}
								</div>
							</td>
						</tr>
						
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AllUsersPage;