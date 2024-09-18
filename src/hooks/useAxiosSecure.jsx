import axios from "axios";
import useAuth from "./useAuth";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";
import auth from "../utils/firebase.config";

export const axiosSecure = axios.create({
	baseURL: "http://localhost:5000",
	// baseURL: "https://newspaper-website-server.vercel.app",
});

const useAxiosSecure = () => {
    const handleSignOut = async () => {
		await signOut(auth)
			.then(() => {
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: `You are successfully logged Out.`,
					showConfirmButton: false,
					timer: 1500,
				});

				localStorage.removeItem("authUser");
			})
			.catch((error) => {
				console.error("Failed to sign out", error);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Failed to Sign Out",
				});
			});
	};
	// request interceptor to add authorization header for every secure call to the api
	axiosSecure.interceptors.request.use(
		function (config) {
			const token = localStorage.getItem("access-token");
			// console.log('request stopped by interceptors', token)
			config.headers.authorization = `Bearer ${token}`;
			return config;
		},
		function (error) {
			// Do something with request error
			return Promise.reject(error);
		}
	);

	// intercepts 401 and 403 status
	axiosSecure.interceptors.response.use(
		function (response) {
			return response;
		},
		async (error) => {
			const status = error.response.status;
			// console.log('status error in the interceptor', status);
			// for 401 or 403 logout the user and move the user to the login
			if (status === 401 || status === 403) {
				handleSignOut;
			}
			return Promise.reject(error);
		}
	);

	return axiosSecure;
};

export default useAxiosSecure;
