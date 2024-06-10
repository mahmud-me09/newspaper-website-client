import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import SKeletonLoader from "../../components/SKeletonLoader";

const tags = [
	{ value: "politics", label: "Politics" },
	{ value: "business", label: "Business" },
	{ value: "sports", label: "Sports" },
	{ value: "entertainment", label: "Entertainment" },
	{ value: "technology", label: "Technology" },
	{ value: "health", label: "Health" },
	{ value: "environment", label: "Environment" },
	{ value: "education", label: "Education" },
];

const imageHostingKey = import.meta.env.VITE_imgbb_API;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddArticlesPage = () => {
	const { user, dbUser } = useAuth();
	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedPublisher, setSelectedPublisher] = useState("");
	const axiosPublic = useAxiosPublic();

	const { data: publisherTags = [], isLoading } = useQuery({
		queryKey: ["publisher"],
		queryFn: async () => {
			const res = await axiosPublic.get("/articles");
			return res.data.map((publisher) => ({
				value: publisher.publisher,
				label: publisher.publisher,
			}));
		},
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);

		try {
			const imageRes = await axios.post(imageHostingAPI, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			const image = imageRes.data.data.display_url;
			const name = form.name.value;
			const publisher = selectedPublisher.value;
			const tags = selectedTags.map((tag) => tag.value);
			const description = form.description.value;
			const isPremium = false;
			const viewCount = 0;
			const isApproved = false;
			const createdAt = new Date().toISOString();
			const articleData = {
				name,
				image,
				publisher,
				tags,
				description,
				isPremium,
				viewCount,
				isApproved,
				createdAt,
				author: {
					name: user.displayName,
					photo: user.photoURL,
					email: user.email,
				},
				userEmail: user.email,
			};

			if (
				dbUser?.isAdmin ||
				dbUser?.isPremium ||
				dbUser?.publishedArticles < 1
			) {
				const res = await axiosPublic.post("/articles", articleData);
				if (res.data.insertedId) {
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: "Article Created Successfully",
						showConfirmButton: false,
						timer: 1500,
					});
					form.reset();
					setSelectedTags([]);
					setSelectedPublisher("");
					await axiosPublic.patch(`/userpublication/${user.email}`, {
						$inc: { publishedArticles: 1 },
					});
				}
			} else {
				Swal.fire({
					position: "top-end",
					icon: "error",
					title: "You have reached your maximum limit for posting articles. Go to the subscription page for posting more articles",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		} catch (error) {
			console.error("Error creating article:", error.message);
			Swal.fire({
				position: "top-end",
				icon: "error",
				title: "An error occurred while creating the article",
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};

	return (
		<div>
			<Helmet>
				<title>Morning Tribune | Add Article</title>
			</Helmet>
			{isLoading ? (
				<SKeletonLoader />
			) : (
				<section className="p-6 dark:bg-gray-100 dark:text-gray-900">
					<form
						onSubmit={handleSubmit}
						className="container flex flex-col mx-auto space-y-12"
					>
						<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
							<div className="space-y-2 col-span-full lg:col-span-1">
								<p className="text-xl">Add Articles Here</p>
								<p className="text-md">
									Add articles here. The fields you have to
									enter are self-explanatory. If there is a
									problem or query, feel free to reach admin
									at:
									<br />
									Cell: +888484848416 <br />
									Email: kdahkdshf@admin.com.
								</p>
							</div>
							<div className="gap-4 col-span-full lg:col-span-3 border-l border-gray-100 pl-4">
								<div className="col-span-full sm:col-span-3">
									<label htmlFor="name" className="text-sm">
										Title:
									</label>
									<input
										name="name"
										type="text"
										placeholder="Article Name"
										className="w-full rounded-md p-4 border border-green-300"
										required
									/>
								</div>

								<div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
									<div className="col-span-full sm:col-span-3">
										<label
											htmlFor="Publisher"
											className="text-sm"
										>
											Publisher:
										</label>
										<Select
											value={selectedPublisher}
											onChange={setSelectedPublisher}
											options={publisherTags}
											isSearchable={true}
											className="w-full p-2.5 rounded-md border border-green-300"
											required
										/>
									</div>
									<div className="col-span-full sm:col-span-3">
										<label
											htmlFor="tags"
											className="text-sm"
										>
											Tags:
										</label>
										<Select
											value={selectedTags}
											onChange={setSelectedTags}
											options={tags}
											isMulti
											className="w-full p-2.5 rounded-md border border-green-300"
											required
										/>
									</div>
								</div>

								<div className="col-span-full">
									<div className="col-span-full sm:col-span-3">
										<label
											htmlFor="description"
											className="text-sm"
										>
											Description:
										</label>
										<textarea
											name="description"
											placeholder="Description"
											className="w-full rounded-md h-40 p-4 border border-green-300"
											required
										/>
									</div>
								</div>
								<div className="col-span-full sm:col-span-3 my-4">
									<label htmlFor="image" className="text-sm">
										Image:
									</label>
									<br />
									<input
										type="file"
										name="image"
										className="file-input rounded-md file-input-bordered  border-green-300 w-full max-w-xs"
										required
									/>
								</div>

								<label
									htmlFor={`my_modal_submit`}
									className="btn btn-success btn-outline w-full"
								>
									Submit
								</label>

								<input
									type="checkbox"
									id={`my_modal_submit`}
									className="modal-toggle"
								/>
								<div className="modal" role="dialog">
									<div className="modal-box">
										<h3 className="text-center font-bold text-lg">
											Hello {user?.displayName}!
										</h3>
										<p className="py-4 text-center">
											Are you sure you want to add this
											article to your database?
										</p>
										<div className="modal-action justify-between">
											<input
												value="confirm"
												type="submit"
												className="btn btn-error w-1/2"
											/>
											<label
												htmlFor={`my_modal_submit`}
												className="btn btn-success w-1/2"
											>
												Exit!
											</label>
										</div>
									</div>
								</div>
							</div>
						</fieldset>
					</form>
				</section>
			)}
		</div>
	);
};

export default AddArticlesPage;
