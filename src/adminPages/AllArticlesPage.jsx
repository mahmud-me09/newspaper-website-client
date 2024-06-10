import React from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import SectionTitle from "../components/SectionTitle";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/SKeletonLoader";

const AllArticlesPage = () => {
	const axiosPublic = useAxiosPublic();

	const {
		data: articles = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["articles", "all"],
		queryFn: async () => {
			const res = await axiosPublic.get("/articles");
			return res.data;
		},
	});

	const handleDeleteButton = (id) => {
		const swalWithBootstrapButtons = Swal.mixin({
			customClass: {
				confirmButton: "btn gap-2 btn-error",
				cancelButton: "btn gap-2 btn-success",
			},
			buttonsStyling: false,
		});
		swalWithBootstrapButtons
			.fire({
				title: "Are you sure?",
				text: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel!",
				reverseButtons: true,
			})
			.then((result) => {
				if (result.isConfirmed) {
					axiosPublic.delete(`/articles/${id}`).then((res) => {
						if (res.data.deletedCount > 0) {
							swalWithBootstrapButtons.fire({
								title: "Deleted!",
								text: "The Article has been deleted.",
								icon: "success",
							});
							refetch();
						}
					});
				} else if (
					/* Read more about handling dismissals below */
					result.dismiss === Swal.DismissReason.cancel
				) {
					swalWithBootstrapButtons.fire({
						title: "Cancelled",
						text: "The Article is not deleted",
						icon: "error",
					});
				}
			});
	};

	const handleApproveButton = (id) => {
		axiosPublic
			.put(`/articles/${id}`, { isApproved: true })
			.then((response) => {
				if (response.data.modifiedCount > 0) {
					refetch();
				}
			})
			.catch((error) => console.log(error));
	};
	const handlePremiumButton = (id) => {
		axiosPublic
			.put(`/articles/${id}`, { isPremium: true })
			.then((response) => {
				if (response.data.modifiedCount > 0) {
					refetch();
				}
			})
			.catch((error) => console.log(error));
	};

	const handleDeclineButton = (article) => {
		Swal.fire({
			title: "Submit Your reason for declining",
			input: "text",
			inputValue: article?.adminMessage || "",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Send to Author",
			showLoaderOnConfirm: true,
			preConfirm: async (message) => {
				try {
					if (article.isApproved) {
						return Swal.showValidationMessage(`
          ${JSON.stringify("You have already Approved this article")}
        `);
					} else {
						const response = await axiosPublic.put(
							`/articles/${article._id}`,
							{ adminMessage: message }
						);
						console.log(response);
						if (!response.ok) {
							refetch();
							return Swal.showValidationMessage(`
          ${JSON.stringify("successfully sent to Author")}
        `);
						}
						return response.json();
					}
				} catch (error) {
					Swal.showValidationMessage(`
        Request failed: ${error}
      `);
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Successfully sent to author",
				});
			}
		});
	};

	// pagination

	const [page, setPage] = React.useState(1);
	const pageSize = 3;

	const startIndex = (page - 1) * pageSize;
	const visibleArticles = articles.slice(startIndex, startIndex + pageSize);

	const totalPages = Math.ceil(articles.length / pageSize);

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
		<>
			<div className="py-4 mr-8">
				<SectionTitle h1={"Admin: All Article Section"}></SectionTitle>
			</div>
			{isLoading ? (
				<SkeletonLoader></SkeletonLoader>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 place-items-center lg:grid-cols-3 gap-4">
					{visibleArticles.map((article) => (
						<div
							key={article._id}
							className="card max-w-96 border bg-base-100 shadow-xl"
						>
							<figure className="px-10 pt-10">
								<img
									src={article.image}
									alt="article"
									className="rounded-xl border-2 shadow-lg shadow-orange-950 w-full h-48"
								/>
							</figure>
							<div className="card-body items-start text-center">
								<h2 className="card-title">
									Title: {article.name}
								</h2>

								<div className="flex gap-2">
									<div>
										<img
											className="h-12 w-12 rounded-full"
											src={
												article?.author?.photo
											}
											alt="author"
										/>
									</div>
									<div className="flex flex-col items-start">
										<p>Author: {article?.author?.name}</p>
										<p>Email: {article?.author?.email}</p>
									</div>
								</div>

								<p>
									Posted Date:{" "}
									{article?.createdAt?.split("T")[0]}
								</p>
								<p>
									Status:{" "}
									{article.adminMessage
										? "Declined"
										: article?.isApproved
										? article?.isPremium
											? "Approved & Premium"
											: "Approved & Non-Premium"
										: "Pending"}
								</p>
								<p>Publisher: {article?.publisher}</p>
								<div className="card-actions flex flex-nowrap gap-4 w-full justify-between">
									<button
										disabled={article?.adminMessage}
										onClick={() =>
											handleApproveButton(article._id)
										}
										className="btn btn-success"
									>
										Approve
									</button>
									<button
										onClick={() =>
											handleDeclineButton(article)
										}
										className="btn btn-warning"
									>
										Decline
									</button>
									<button
										onClick={() =>
											handleDeleteButton(article._id)
										}
										className="btn btn-error"
									>
										Delete
									</button>
								</div>
								<div className="card-actions w-full py-2">
									<button
										disabled={article?.adminMessage}
										onClick={() =>
											handlePremiumButton(article._id)
										}
										className="btn btn-outline btn-info btn-block"
									>
										Make Premium
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<div className="flex justify-center mt-4">
				<nav className="pagination">
					<ul className="flex gap-2">
						<li
							onClick={goToPreviousPage}
							className="btn"
						>{`<<`}</li>
						{[...Array(totalPages).keys()].map((pageNumber) => (
							<li key={pageNumber}>
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
						<li onClick={goToNextPage} className="btn">{`>>`}</li>
					</ul>
				</nav>
			</div>
		</>
	);
};

export default AllArticlesPage;
