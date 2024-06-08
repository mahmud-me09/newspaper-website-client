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
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const db = getFirestore();
	const axiosPublic = useAxiosPublic();
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

	useEffect(() => {
		if (user) {
			axiosPublic
				.get(`/users?email=${user.email}`)
				.then((response) => setIsAdmin(response.data.isAdmin))
				.catch((error) => {
					console.error("Failed to fetch user data", error);
					setIsAdmin(false);
				});
		}
	}, [user, axiosPublic]);

	const handlePremiumStatus = async (currentUser) => {
		try {
			const userDocRef = doc(db, "users", currentUser.uid);
			const userDoc = await getDoc(userDocRef);
			console.log("premium")
			if (userDoc.exists()) {
				const userData = userDoc.data();
				if (userData?.premiumTaken) {
					const currentTime = new Date();
					const premiumTakenTime = new Date(
						userData.premiumTaken.seconds * 1000
					);

					if (currentTime > premiumTakenTime) {
						await updateDoc(userDocRef, { premiumTaken: null });
					}
					else{

					}
				}
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error fetching or updating user document", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth,  (currentUser) => {
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
				setLoading(false);
			}
			console.log("observing", currentUser);
		});
		return () => unsubscribe();
	}, [isAdmin]);

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
