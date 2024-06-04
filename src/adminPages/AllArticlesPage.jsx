
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import SectionTitle from "../components/SectionTitle";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../components/SKeletonLoader"

const AllArticlesPage = () => {
	const { user } = useAuth();
	const axiosSecure = useAxiosSecure();

	const {
		data: articles = [],
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["articles"],
		queryFn: async () => {
			const res = await axiosSecure.get("/articles");
			return res.data;
		},
	});


	const handleApproveButton = (id) => {
		axiosSecure
			.put(`/articles/${id}`, { isApproved: true })
			.then((response) => {
				if (response.data.modifiedCount > 0) {
					refetch();
				}
			})
			.catch((error) => console.log(error));
	};
	const handlePremiumButton = (id) => {
		axiosSecure
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
						const response = await axiosSecure.put(
							`/articles/${article._id}`,
							{ adminMessage: message }
						);
						console.log(response);
						if (!response.ok) {
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

	return (
		<>
			<div className="py-4 mr-8">
				<SectionTitle h1={"Admin: All Article Section"}></SectionTitle>
			</div>
			{isLoading ? (
				<SkeletonLoader></SkeletonLoader>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{articles.map((article) => (
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
												article?.author?.image ||
												"https://i.ibb.co/vJ6npKh/jonny-Depp.jpg"
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
										: "Unapproved"}
								</p>
								<p>Publisher: {article?.publisher}</p>
								<div className="card-actions flex flex-nowrap gap-4 w-full justify-between">
									<button
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
									<button className="btn btn-error">
										Delete
									</button>
								</div>
								<div className="card-actions w-full py-2">
									<button
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
		</>
	);
};

export default AllArticlesPage;
