import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AllUsersPage = () => {
	const axiosSecure = useAxiosSecure();
	const [isAdmin, setIsAdmin] = useState(false);
	// const [users, setUsers] = useState([]);
	const handleMakeAdmin = (id) => {
		setIsAdmin(true);
		axiosSecure.patch(`/users/${id}`,{isAdmin:true})
		.then(res=>{
			if(res.data.modifiedCount>0){
				console.log(success)
			}
		})
		.catch(error=>console.log(error.message))
	};
	
	const {
		data: users = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await axiosSecure.get("/users");
			return res.data;
		},
	});

	// useEffect(() => {
	// 	axiosSecure
	// 		.get("/users")
	// 		.then((res) => {
	// 			setUsers(res.data);
	// 			console.log(res.data);
	// 			setIsAdmin(res.data.isAdmin)
	// 		})
	// 		.catch((error) => console.log(error.message));
	// }, []);

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
						{users.map((user, idx) => (
							<tr
								key={idx}
								className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
							>
								<td className="p-3">
									<div className="flex items-center gap-3">
										<div className="avatar">
											<div className="mask mask-squircle w-12 h-12">
												<img
													src={user?.photoURL}
													alt="Avatar Tailwind CSS Component"
												/>
											</div>
										</div>
										<div>
											<div className="font-bold">
												{user.name}
											</div>
										</div>
									</div>
								</td>
								<td className="p-3">
									<p>{user.email}</p>
								</td>

								<td className="p-3 text-right">
									<div className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">
										{isAdmin || user.isAdmin ? (
											<p className="text-green-400 text-lg">
												Admin
											</p>
										) : (
											<button
												className="btn"
												onClick={()=>handleMakeAdmin(user._id)}
											>
												Make Admin
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AllUsersPage;
