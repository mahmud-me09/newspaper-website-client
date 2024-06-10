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
// import useAxiosSecure from "../hooks/useAxiosSecure";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isPremium, setIsPremium] = useState(false);
	// const axiosSecure = useAxiosSecure();
	const axiosPublic = useAxiosPublic();
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("authUser");
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [dbUser, setDbUser] = useState(null);
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

	useEffect(() => {
		if (user) {
			axiosPublic
				.get(`/users?email=${user.email}`)
				.then((response) => {
					setIsAdmin(response.data.isAdmin);
					setIsPremium(response.data?.isPremium);
					setDbUser(response.data);
				})
				.catch((error) => {
					console.error("Failed to fetch user data", error);
					setIsAdmin(false);
					setIsPremium(false);
					setDbUser(null);
				});
		}
	}, [user, axiosPublic]);

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
				// If subscription expired, update premium status to false
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
			if (user && !dbUser.isAdmin) {
				handlePremiumStatus(user);
			}
		}, 60000); // Check every minute
		return () => clearInterval(interval);
	}, [user, dbUser]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				if (!isAdmin) {
					handlePremiumStatus(currentUser);
				}
				localStorage.setItem("authUser", JSON.stringify(currentUser));
				setUser(currentUser);
				setLoading(false);
			} else {
				localStorage.removeItem("authUser");
				setUser(null);
				setDbUser(null);
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
