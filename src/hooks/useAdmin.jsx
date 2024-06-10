import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useAdmin = () => {
	const { user, loading } = useAuth();
	const axiosPublic = useAxiosPublic();
	const { data: isAdmin, isPending: isAdminLoading } = useQuery({
		queryKey: ["isAdmin", user?.email],
		enabled: !loading,
		queryFn: async () => {
			// console.log("asking or checking is admin", user);
			const res = await axiosPublic.get(`/users?email=${user.email}`);
			// console.log(res.data.isAdmin);
			return res.data?.isAdmin;
		},
	});
	return [isAdmin, isAdminLoading];
};

export default useAdmin;
