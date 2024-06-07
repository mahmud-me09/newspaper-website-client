import React, { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation, useQuery } from "@tanstack/react-query";
import SKeletonLoader from "../components/SKeletonLoader";

const AllUsersPage = () => {
	const axiosSecure = useAxiosSecure();

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

	const mutation = useMutation({
		mutationFn: (id) =>
			axiosSecure
				.patch(`/users/${id}`, { isAdmin: true })
				.then((res) => refetch()),
		onSuccess: () => {
			queryClient.invalidateQueries(["users"]);
		},
	});

	const handleMakeAdmin = (id) => {
		mutation.mutate(id);
	};
	// pagination
	const [page, setPage] = useState(1);
	const pageSize = 3;
	const totalPages = Math.ceil(users.length / pageSize);
	const startIndex = (page - 1) * pageSize;
	const visibleUsers = users.slice(startIndex, startIndex + pageSize);

	const goToPage = (pageNumber) => {
		setPage(pageNumber);
	};
	const goToPreviousPage = () => {
		setPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const goToNextPage = () => {
		setPage((prevPage) => Math.min(prevPage + 1, totalPages));
	};

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
					{isLoading ? (
						<SKeletonLoader></SKeletonLoader>
					) : (
						<tbody>
							{visibleUsers.map((user, idx) => (
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
											{user.isAdmin ? (
												<p className="text-green-400 text-lg">
													Admin
												</p>
											) : (
												<button
													className="btn"
													onClick={() =>
														handleMakeAdmin(
															user._id
														)
													}
												>
													Make Admin
												</button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
			<div className="flex justify-center mt-4">
				<nav className="pagination">
					<ul className="flex gap-2">
						<li
							className={`page-item ${
								page === 1 ? "disabled" : ""
							}`}
						>
							<button
								className="page-link btn"
								onClick={goToPreviousPage}
								disabled={page === 1}
							>
								{"<<"}
							</button>
						</li>
						{[...Array(totalPages).keys()].map((pageNumber) => (
							<li key={pageNumber} className={`page-item`}>
								<button
									className={`page-link btn ${
										pageNumber + 1 === page
											? "bg-blue-500 text-white"
											: ""
									}`}
									onClick={() => goToPage(pageNumber + 1)}
								>
									{pageNumber + 1}
								</button>
							</li>
						))}
						<li
							className={`page-item ${
								page === totalPages ? "disabled" : ""
							}`}
						>
							<button
								className="page-link btn"
								onClick={goToNextPage}
								disabled={page === totalPages}
							>
								{">>"}
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default AllUsersPage;
