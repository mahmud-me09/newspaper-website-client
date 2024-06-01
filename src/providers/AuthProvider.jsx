import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../utils/firebase.config";
import Swal from "sweetalert2";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("authUser");
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [loading, setLoading] = useState(true);

	const googleProvider = new GoogleAuthProvider();
	const handleGoogleSignIn = () => {
		signInWithPopup(auth, googleProvider)
			.then((result) => {
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				Swal.fire({
					position: "top-end",
					icon: "success",
					title: `Hi ${user.displayName}! You are logged in.`,
					showConfirmButton: false,
					timer: 1500,
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.customData.email;
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				console.log(
					errorMessage,
					errorCode,
					email,
					"credential Error",
					credential
				);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Something went wrong!",
					footer: `This happened because ${errorMessage}`,
				});
			});
	};

    

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signInUser = (email, password) => {
		setLoading(false);
		return signInWithEmailAndPassword(auth, email, password);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			const userEmail = currentUser?.email || user?.email;
			const loggedUser = { email: userEmail };

			if (currentUser) {
				localStorage.setItem("authUser", JSON.stringify(currentUser));
				setUser(currentUser);
				setLoading(false);

				// axios
				// 	.post(
				// 		"https://globalpalate-a11-server.vercel.app/jwt",
				// 		loggedUser,
				// 		{ withCredentials: true }
				// 	)
				// 	.then((res) => console.log("token response", res.data))
				// 	.catch((error) => console.error(error.message));
			} else {
				localStorage.removeItem("authUser");
				setUser(null);
				// axios
				// 	.post(
				// 		`https://globalpalate-a11-server.vercel.app/logout`,
				// 		loggedUser,
				// 		{ withCredentials: true }
				// 	)
				// 	.then((res) => console.log(res.data))
				// 	.catch((error) => console.error(error.message));
			}
			console.log("observing", currentUser);
		});
		return () => unsubscribe();
	}, []);

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
			})
			.catch((error) => {
				console.error(error);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Failed to Sign Out",
					footer: `This happened because ${errorMessage}`,
				});
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
	return <AuthContext.Provider value={authInfo} >{children}</AuthContext.Provider>
};

export default AuthProvider;
