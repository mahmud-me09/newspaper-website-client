import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
// import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

const usePremium = () => {
	const { user, loading } = useAuth();
	const axiosSecure = useAxiosSecure();
	const { data: isPremium, isPending: isPremiumLoading, refetch } = useQuery({
		queryKey: ["isPremium", user?.email],
		enabled: !loading,
		queryFn: async () => {
			const res = await axiosSecure.get(`/users/${user.email}`);
			console.log("isPremium: ", res.data?.isPremium);
			if(res.data?.isAdmin){
				return true
			}
			return res.data?.isPremium;
		},
	});
	return [isPremium, isPremiumLoading, refetch];
};

export default usePremium;
