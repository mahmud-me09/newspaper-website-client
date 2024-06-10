import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
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

const UpdateArticle = () => {
	const location = useLocation();
	const stateArticle = location.state.article;
	const {
		data: article = stateArticle,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["article", stateArticle._id],
		queryFn: async () => {
			const res = await axiosPublic.get(
				`/articledetail/${stateArticle._id}`
			);
			return res.data;
		},
	});
	const axiosPublic = useAxiosPublic();
	const { user } = useAuth();
	const [selectedTags, setSelectedTags] = useState(
		article.tags.map((tag) => ({
			value: tag,
			label: tag,
		}))
	);
	console.log(selectedTags);
	const [selectedPublisher, setSelectedPublisher] = useState({
		value: article.publisher,
		label: article.publisher,
	});

	console.log(article);
	const { data: publisherTags = [], isLoading: isLoadingPublisher } =
		useQuery({
			queryKey: ["publisher"],
			queryFn: async () => {
				const res = await axiosPublic.get("/articles");
				const publishersArray = res.data;
				const publishertags = publishersArray.map((publisher) => ({
					value: publisher.publisher,
					label: publisher.publisher,
				}));
				return publishertags;
			},
		});

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		let image = article.image;
		if (form.image.files[0]) {
			res = await axios.post(
				imageHostingAPI,
				{ image: form.image.files[0] },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			image = res.data.data.display_url;
		}

		const name = form.name.value;
		const publisher = selectedPublisher.value;
		const tags = selectedTags.map((selectedTag) => selectedTag.value);
		const description = form.description.value;
		const isPremium = article.isPremium;
		const viewCount = article.viewCount;
		const isApproved = article.isApproved;
		const userEmail = article.author.email;
		const createdAt = article.createdAt;
		const formData = {
			name,
			image,
			publisher,
			tags,
			createdAt,
			author: {
				name: article.author.name,
				photo: article.author.photo,
				email: article.author.email,
			},
			description,
			userEmail,
			isPremium,
			viewCount,
			isApproved,
		};

		axiosPublic
			.put(`/articles/${article._id}`, formData)
			.then((res) => {
				if (res.data.modifiedCount) {
					refetch();
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: `Article Update Successfully`,
						showConfirmButton: false,
						timer: 1500,
					});
					form.reset();
				} else if (
					res.data.matchedCount > 0 &&
					res.data.modifiedCount == 0
				) {
					Swal.fire({
						position: "top-end",
						icon: "error",
						title: `Article is not modified`,
						showConfirmButton: false,
						timer: 1500,
					});
				}
			})
			.catch((error) => console.log(error.message));
	};

	return (
		<section className="p-6 dark:bg-gray-100 dark:text-gray-900">
			<Helmet>
				<title>Morning Tribune | Add Article</title>
			</Helmet>
			<form
				onSubmit={handleSubmit}
				className="container flex flex-col mx-auto space-y-12"
			>
				<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
					<div className="space-y-2 col-span-full lg:col-span-1">
						<p className="text-xl">Add Articles Here</p>
						<p className="text-md">
							Add articles here. The fields you have to enter is
							self explainatory. If there is a problem and query
							feel free to reach admin on <br />
							Cell: +888484848416 <br /> Email:
							kdahkdshf@admin.com.
						</p>
					</div>
					{isLoading && isLoadingPublisher ? (
						<SKeletonLoader></SKeletonLoader>
					) : (
						<div className="gap-4 col-span-full lg:col-span-3 border-l border-gray-100 pl-4">
							<div className="col-span-full sm:col-span-3">
								<label htmlFor="name" className="text-sm">
									Title:
								</label>
								<input
									name="name"
									defaultValue={article.name}
									type="text"
									placeholder="Article Name"
									className="w-full rounded-md p-4 border border-green-300"
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
										defaultValue={selectedPublisher}
										onChange={setSelectedPublisher}
										options={publisherTags}
										isMulti={false}
										className="w-full p-2.5 rounded-md border border-green-300"
									/>
								</div>
								<div className="col-span-full sm:col-span-3">
									<label htmlFor="tags" className="text-sm">
										Tags:
									</label>
									<Select
										defaultValue={selectedTags}
										onChange={setSelectedTags}
										options={tags}
										isMulti={true}
										className="w-full p-2.5 rounded-md border border-green-300"
									/>
								</div>
							</div>

							<div className="col-span-full">
								<div className="col-span-full sm:col-span-3">
									<label
										htmlFor="Description"
										className="text-sm"
									>
										Description:
									</label>
									<textarea
										name="description"
										defaultValue={article?.description}
										type="text"
										placeholder="Description"
										className="w-full rounded-md h-40 p-4 border border-green-300"
									/>
								</div>
							</div>
							<div className="col-span-full  sm:col-span-3 my-4">
								<label htmlFor="image" className="text-sm">
									Image:
								</label>
								<br />
								<input
									type="file"
									name="image"
									className="file-input rounded-md file-input-bordered  border-green-300 w-full max-w-xs"
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
									<h3 className=" text-center font-bold text-lg">
										Hello {user?.displayName}!
									</h3>
									<p className="py-4 text-center">
										Are You sure You want to Update this
										Article to your database?
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
					)}
				</fieldset>
			</form>
		</section>
	);
};

export default UpdateArticle;
