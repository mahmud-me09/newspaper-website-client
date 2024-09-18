import {
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import auth from "../utils/firebase.config";
import Swal from "sweetalert2";
import { createContext, useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	const axiosPublic = useAxiosPublic();
	const axiosSecure = useAxiosSecure()
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("authUser");
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [loading, setLoading] = useState(true);

	const googleProvider = new GoogleAuthProvider();
	const handleGoogleSignIn = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider);
	};

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signInUser = (email, password) => {
		setLoading(true);
		return signInWithEmailAndPassword(auth, email, password);
	};

	const { data: dbUser, refetch } = useQuery({
		queryKey: ["dbUser"],
		enabled: !!user,
		queryFn: async () => {
			try {
				const response = await axiosSecure.get(
					`/users/${user?.email}`
				);
				setIsAdmin(response.data?.isAdmin);
				setIsPremium(response.data?.isPremium);
				return response.data;
			} catch (error) {
				console.error("Failed to fetch user data", error);
				setIsAdmin(false);
				setIsPremium(false);
			}
		},
	});

	const handlePremiumStatus = async (currentUser) => {
		try {
			if (!dbUser) {
				console.error(
					"User data not available to check premium status"
				);
				return;
			}
			if (!dbUser.subscriptionHistory?.expiredDate) {
				return;
			}

			const currentDate = new Date();
			const expiredDate = new Date(
				dbUser.subscriptionHistory?.expiredDate
			);

			if (currentDate > expiredDate) {
				const res = await axiosPublic.put(
					`/payment?email=${currentUser.email}`,
					{
						isPremium: false,
					}
				);
				console.log("User premium status updated to false");

				setIsPremium(false);
			} else {
				// If subscription is active
				const res = await axiosPublic.put(
					`/payment?email=${currentUser.email}`,
					{
						isPremium: true,
					}
				);
				console.log("User premium status updated to true");
				setIsPremium(true);
			}
		} catch (error) {
			console.error("Failed to update premium status", error);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
			if (user && !dbUser?.isAdmin) {
				handlePremiumStatus(dbUser);
			}
		}, 30000); // Check every minute
		return () => clearInterval(interval);
	}, [user, isPremium]);

	useEffect(() => {
		refetch();
	}, [isPremium]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				if (!isAdmin) {
					handlePremiumStatus(currentUser);
				}
				localStorage.setItem("authUser", JSON.stringify(currentUser));
				setUser(currentUser);
				setLoading(false);
				const userInfo = { email: currentUser.email };
				axiosPublic
					.post("/jwt", userInfo)

					.then((res) => {
						if (res.data.token) {
							localStorage.setItem(
								"access-token",
								res.data.token
							);
						}
					});
			} else {
				localStorage.removeItem("authUser");
				localStorage.removeItem("access-token");
				setUser(null);

				setIsAdmin(false);
				setIsPremium(false);
				setLoading(false);
			}
			console.log("observing", currentUser);
		});
		return () => unsubscribe();
	}, [isAdmin, dbUser]);

	const handleSignOut = async () => {
		setLoading(true);

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
				setUser(null);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to sign out", error);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Failed to Sign Out",
				});
				setLoading(false);
			});
	};

	const authInfo = {
		handleGoogleSignIn,
		user,
		dbUser,
		loading,
		setLoading,
		setUser,
		createUser,
		signInUser,
		handleSignOut,
	};
	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
