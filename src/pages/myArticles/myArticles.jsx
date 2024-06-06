import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import SectionTitle from '../../components/SectionTitle';
import { useNavigate } from 'react-router-dom';
import SKeletonLoader from '../../components/SKeletonLoader';

const MyArticles = () => {
    const {user} = useAuth()
    const navigate = useNavigate()
    const axiosSecure = useAxiosSecure()
    const {
		data: articles = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["articles", user.email],
		queryFn: async () => {
			const res = await axiosSecure.get(`/articles?email=${user.email}`);
			return res.data;
		},
	});

    return (
		<div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
			<SectionTitle h1={"My Articles"} />
			<div className="overflow-x-auto">
				<table className="min-w-full text-xs">
					<colgroup>
						<col />
						<col />
						<col />
						<col />
						<col />
						<col className="w-24" />
					</colgroup>
					<thead className="dark:bg-gray-300">
						<tr className="text-left">
							<th className="p-3">S/N</th>
							{/* article title,details button,status,isPremium,update
button,delete button */}
							<th className="p-3">Article Title</th>
							<th className="p-3">Details</th>
							<th className="p-3">Status</th>
							<th className="p-3">Premium</th>
							<th className="p-3">Update</th>
							<th className="p-3">Delete</th>
						</tr>
					</thead>
					{isLoading ? (
						<SKeletonLoader></SKeletonLoader>
					) : (
						<tbody>
							{articles.map((article, idx) => (
								<tr
									key={idx}
									className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
								>
									<td>{idx + 1}</td>
									<td className="p-3">{article.name}</td>
									<td className="p-3">
										<button
											onClick={() => {
												navigate(
													`/articles/${article._id}`
												);
												axiosSecure
													.patch(
														`/articledetail/${article._id}`,
														{
															$inc: {
																viewCount: 1,
															},
														}
													)
													.then((res) => {
														console.log(res.data);
													})
													.catch((error) => {
														console.log(
															error.message
														);
													});
											}}
											className="btn"
										>
											Details
										</button>
									</td>
									<td
										className={`p-3 ${
											article.adminMessage
												? "text-red-600"
												: article?.isApproved
												? article?.isPremium
													? "text-blue-500"
													: "text-green-400"
												: "text-yellow-500"
										}`}
									>
										{article.adminMessage
											? "Declined"
											: article?.isApproved
											? article?.isPremium
												? "Approved & Premium"
												: "Approved & Non-Premium"
											: "Pending"}
									</td>
									<td
										className={`p-3 ${
											article.isPremium
												? "text-black"
												: "text-blue-600"
										}`}
									>
										{article.isPremium ? "Yes" : "No"}
									</td>
									<td>
										<button className="btn">Update</button>
									</td>
									<td>
										<button className="btn">Delete</button>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
			</div>
		</div>
	);
};

export default MyArticles;