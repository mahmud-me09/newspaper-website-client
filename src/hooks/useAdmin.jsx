import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
// import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
	const { user, loading } = useAuth();
	const axiosSecure = useAxiosSecure();
	const { data: isAdmin, isPending: isAdminLoading } = useQuery({
		queryKey: ["isAdmin", user?.email],
		enabled: !loading,
		queryFn: async () => {
			const res = await axiosSecure.get(`/users/${user.email}`);
			console.log("Admin:", res.data?.isAdmin);
			return res.data?.isAdmin;
		},
	});
	return [isAdmin, isAdminLoading];
};

export default useAdmin;
