import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import useImageHosting from "../../hooks/useImageHosting";
import useAuth from "../../hooks/useAuth";

const myProfile = () => {
	const { user, setUser } = useAuth();
	const imageHosting = useImageHosting;


	 const [isEditing, setIsEditing] = useState(false);

		const {
			register,
			handleSubmit,
			formState: { errors },
			reset,
		} = useForm({
			defaultValues: {
				Name: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
			},
		});

		const handleEditClick = () => {
			setIsEditing(true);
		};

		const handleCancelClick = () => {
			setIsEditing(false);
			reset({
				Name: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
			});
		};

		const onSubmit = async (data) => {
			try {
				let image = user.photoURL;
				if (data.photoURL.length > 0) {
					image = await imageHosting(data.photoURL[0]);
				}

				await updateProfile(user, {
					displayName: data.Name,
					photoURL: image,
				});
			

				setUser({
					...user,
					displayName: data.Name,
					photoURL: image,
				});

				Swal.fire({
					position: "top-end",
					icon: "success",
					title: "Profile Updated Successfully",
					showConfirmButton: false,
					timer: 1500,
				});

				setIsEditing(false);
			} catch (error) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Failed to Update Profile",
					footer: `This happened because ${error}`,
				});
			}
		};

	return (
		<>
			<Helmet>
				<title>Morning Tribune | Profile</title>
			</Helmet>
			<div className="flex items-center justify-center px-20">
				<div className="w-full my-4 mx-auto max-w-md p-4 border border-green-500 rounded-md shadow sm:p-8 dark:bg-green-50 dark:text-green-800">
					<h2 className="mb-3 text-3xl font-semibold text-center">
						My Profile
					</h2>
					{!isEditing ? (
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="block text-sm">Name</label>
								<p className="px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800">
									{user.displayName}
								</p>
							</div>
							<div className="space-y-2">
								<label className="block text-sm">Email</label>
								<p className="px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800">
									{user.email}
								</p>
							</div>
							<div className="space-y-2">
								<label className="block text-sm">Photo</label>
								<img
									src={user.photoURL}
									alt="Profile"
									className="w-24 h-24 rounded-full"
								/>
							</div>
							<button
								className="btn mt-4 btn-success btn-outline"
								onClick={handleEditClick}
							>
								Update Profile
							</button>
						</div>
					) : (
						<form
							className="flex flex-col"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<label
										htmlFor="name"
										className="block text-sm"
									>
										Name
										<span className="text-red-500">*</span>
									</label>
									<input
										id="name"
										className="w-full px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800 focus:dark:border-green-600"
										type="text"
										placeholder="Name"
										{...register("Name", {
											required: "Name is required",
										})}
										aria-invalid={
											errors.Name ? "true" : "false"
										}
									/>
									{errors.Name && (
										<p
											role="alert"
											className="text-red-600"
										>
											{errors.Name.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="block text-sm"
									>
										Email address
										<span className="text-red-500">*</span>
									</label>
									<input
										id="email"
										className="w-full px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800 focus:dark:border-green-600"
										type="text"
										placeholder="Email"
										{...register("email", {
											required:
												"Email Address is required",
											pattern: {
												value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
												message: "Not a valid email",
											},
										})}
										aria-invalid={
											errors.email ? "true" : "false"
										}
										disabled
									/>
									{errors.email && (
										<p
											className="text-red-500"
											role="alert"
										>
											{errors.email.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<label
										htmlFor="photoURL"
										className="block text-sm"
									>
										Photo File
									</label>
									<input
										id="photoURL"
										className="w-full px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800 focus:dark:border-green-600"
										type="file"
										placeholder="Photo URL"
										{...register("photoURL")}
									/>
								</div>
							</div>
							<div className="flex justify-between mt-4">
								<button
									className="btn btn-success btn-outline"
									type="submit"
								>
									Save
								</button>
								<button
									className="btn btn-danger btn-outline"
									type="button"
									onClick={handleCancelClick}
								>
									Cancel
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</>
	);
};

export default myProfile;
