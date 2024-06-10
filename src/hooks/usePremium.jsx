import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const usePremium = () => {
	const { user, loading } = useAuth();
	const axiosPublic = useAxiosPublic();
	const { data: isPremium, isPending: isPremiumLoading, refetch } = useQuery({
		queryKey: ["isPremium", user?.email],
		enabled: !loading,
		queryFn: async () => {
			const res = await axiosPublic.get(`/users?email=${user.email}`);

			return res.data?.isPremium;
		},
	});
	return [isPremium, isPremiumLoading, refetch];
};

export default usePremium;
