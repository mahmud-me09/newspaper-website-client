import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRouter = ({ children }) => {
	const { user, loading } = useContext(AuthContext);
	const location = useLocation();
	// console.log(location.pathname);

	if (user) {
		if (loading) {
			return <progress className="progress w-56" />;
		}
		return children; // this children is the page component on the Router.jsx
	}

	return (
		<Navigate
			to="/login"
			state={{ from: location }}
			replace={true}
		></Navigate>
	); // if not authenticated it is routed to login page
};

export default PrivateRouter;
