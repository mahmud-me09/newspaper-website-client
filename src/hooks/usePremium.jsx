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
			const res = await axiosSecure.get(`/users?email=${user.email}`);

			return res.data?.isPremium;
		},
	});
	return [isPremium, isPremiumLoading];
};

export default usePremium;
