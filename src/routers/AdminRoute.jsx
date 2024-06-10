import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import Swal from "sweetalert2";

const AdminRoute = ({ children }) => {
	const { user, loading: userLoading } = useAuth();
	const [isAdmin, isAdminLoading] = useAdmin();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (userLoading || isAdminLoading) {
		return <progress className="progress w-56"></progress>;
	}

	if (user && !isAdmin) {
		Swal.fire({
			position: "top-end",
			icon: "error",
			title: "You are not an admin",
			showConfirmButton: false,
			timer: 1500,
		});
		return <Navigate to="/" replace />;
	}

	if (user && isAdmin) {
		return children;
	}

	return null;
};

export default AdminRoute;
