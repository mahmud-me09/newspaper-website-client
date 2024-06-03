import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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
	const { user } = useContext(AuthContext);
	const [selectedTags, setSelectedTags] = useState([]);
	const [publisherTags, setPublisherTags] = useState([]);
	const [selectedPublisher, setSelectedPublisher] = useState("");
	const axiosSecure = useAxiosSecure();

	useEffect(() => {
		axiosSecure
			.get("/publisher")
			.then((res) => {
				const publishersArray = res.data;
				const publishers = publishersArray.map((publisher) => ({
					value: publisher.publisher,
					label: publisher.publisher,
				}));
				setPublisherTags(publishers);
			})
			.catch((error) => console.log(error));
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		
		const res = await axios.post(
			imageHostingAPI,
			{ image: form.image.files[0] },
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		const name = form.name.value;
		const image = res.data.data.display_url;
		const publisher = selectedPublisher.value;
		const tags = selectedTags.map((selectedTag) => selectedTag.value);
		const description = form.description.value;
		const isPremium = user.isPremium || false;
		const viewCount = 0;
		const isApproved = false;
		const userEmail = user.email;
		const formData = {
			name,
			image,
			publisher,
			tags,
			description,
			userEmail,
			isPremium,
			viewCount,
			isApproved,
		};
		console.log(formData);
		// if(user?.allowedFor >= user?.publishedArticles){
		// 	Swal.fire({
		// 		position: "top-end",
		// 		icon: "error",
		// 		title: `You have reached your maximum limit for posting articles. Go to the subscription page for posting more articles`,
		// 		showConfirmButton: false,
		// 		timer: 1500,
		// 	});
		// 	form.reset();
		// }else{
		axiosSecure
			.post("/articles", formData)
			.then((res) => {
				console.log(res);
				if (res.data.insertedId) {
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: `Article Created Successfully`,
						showConfirmButton: false,
						timer: 1500,
					});
					form.reset();
				}
			})
			.catch((error) => console.log(error.message));
		// }
	};

	return (
		<div>
			<Helmet>
				<title>Morning Tribune | Add Food</title>
			</Helmet>
			<section className="p-6 dark:bg-gray-100 dark:text-gray-900">
				<form
					onSubmit={handleSubmit}
					className="container flex flex-col mx-auto space-y-12"
				>
					<fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
						<div className="space-y-2 col-span-full lg:col-span-1">
							<p className="text-xl">Add Articles Here</p>
							<p className="text-md">
								Add articles here. The fields you have to enter
								is self explainatory. If there is a problem and
								query feel free to reach admin on <br />
								Cell: +888484848416 <br /> Email:
								kdahkdshf@admin.com.
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
										Are You sure You want to Add this Food
										to your food database?
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
		</div>
	);
};

export default AddArticlesPage;
