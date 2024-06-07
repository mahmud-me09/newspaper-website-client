import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import img from "../../assets/logo.png";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useImageHosting from "../../hooks/useImageHosting";

const RegistrationPage = () => {
	const axiosPublic = useAxiosPublic();
	const navigate = useNavigate();
	const location = useLocation();
	const { from } = location.state || { from: { pathname: "/" } };

	const [showPassword, setShowPassword] = useState(false);

	const { createUser, setUser } = useContext(AuthContext);
	const imageHosting = useImageHosting

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const onSubmit = async (data) => {
		try {
			const image = await imageHosting(data.photoURL[0]);
			const userCredential = await createUser(data.email, data.password);
			const newUser = userCredential.user;
			await updateProfile(newUser, {
				displayName: data.Name,
				photoURL: image,
			});
			setUser({
				...newUser,
				displayName: data.Name,
				photoURL: image,
			});

			const userInfo = {
				name: data.Name,
				email: data.email,
				photoURL: image,
				isAdmin: false,
				allowedFor: 1,
				publishedArticles: 0,
				subscriptionHistory: [],
			};

			const response = await axiosPublic.post("/users", userInfo);
			console.log(response)
			if (response.data.insertedId) {
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: `User Created Successfully`,
					showConfirmButton: false,
					timer: 1500,
				});
				setTimeout(() => navigate(from), 2000);
				reset();
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Failed to Register",
				footer: `This happened because ${error.message}`,
			});
		}
	};

	return (
		<>
			<Helmet>
				<title>Morning Tribune | Registration</title>
			</Helmet>
			<div className="flex items-center justify-between px-20">
				<div className="hidden md:flex justify-center h-96">
					<img src={img} alt="Logo" />
				</div>
				<div className="w-full my-4 mx-auto max-w-md p-4 border border-green-500 rounded-md shadow sm:p-8 dark:bg-green-50 dark:text-green-800">
					<h2 className="mb-3 text-3xl font-semibold text-center">
						Register Here
					</h2>
					<form
						className="flex flex-col"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="space-y-4">
							<div className="space-y-2">
								<label htmlFor="name" className="block text-sm">
									Name<span className="text-red-500">*</span>
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
									<p role="alert" className="text-red-600">
										{errors.Name.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<label
									htmlFor="photoURL"
									className="block text-sm"
								>
									Photo URL
									<span className="text-red-500">*</span>
								</label>
								<input
									id="photoURL"
									className="w-full px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800 focus:dark:border-green-600"
									type="file"
									placeholder="Photo URL"
									{...register("photoURL", {
										required: "Photo URL is required",
									})}
									aria-invalid={
										errors.photoURL ? "true" : "false"
									}
								/>
								{errors.photoURL && (
									<p className="text-red-600" role="alert">
										{errors.photoURL.message}
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
										required: "Email Address is required",
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
											message: "Not a valid email",
										},
									})}
									aria-invalid={
										errors.email ? "true" : "false"
									}
								/>
								{errors.email && (
									<p className="text-red-500" role="alert">
										{errors.email.message}
									</p>
								)}
							</div>
							<div className="space-y-2 relative">
								<label htmlFor="password" className="text-sm">
									Password
									<span className="text-red-500">*</span>
								</label>
								<input
									id="password"
									className="w-full px-3 py-2 border rounded-md dark:border-green-300 dark:bg-green-50 dark:text-green-800 focus:dark:border-green-600"
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message:
												"Password must be at least 6 characters long",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
											message:
												"Password must contain at least one uppercase, one lowercase, and be at least 6 characters long",
										},
									})}
								/>
								<div
									onClick={handleShowPassword}
									className="absolute bottom-3 right-4 cursor-pointer"
								>
									{showPassword ? <FaEye /> : <FaEyeSlash />}
								</div>
								{errors.password && (
									<p
										role="alert"
										className="text-red-600 absolute"
									>
										{errors.password.message}
									</p>
								)}
							</div>
						</div>
						<button
							className="btn mt-16 btn-success btn-outline mb-4"
							type="submit"
						>
							Register
						</button>
					</form>
					<p className="text-center">
						Already have an account? Please{" "}
						<Link className="underline text-blue-600" to="/login">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default RegistrationPage;
