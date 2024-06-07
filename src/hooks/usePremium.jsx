import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const usePremium = () => {
	const { user, loading } = useAuth();
	const axiosSecure = useAxiosSecure();
	const { data: isPremium, isPending: isPremiumLoading } = useQuery({
		queryKey: ["isPremium", user?.email],
		enabled: !loading,
		queryFn: async () => {
			// console.log("asking or checking is admin", user);
			const res = await axiosSecure.get(`/users?email=${user.email}`);
			// console.log(res.data.isAdmin);
			return res.data?.allowedFor >= 5;
		},
	});
	return [isPremium, isPremiumLoading];
};

export default usePremium;
