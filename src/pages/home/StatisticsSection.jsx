import React from "react";
import CountUp from "react-countup";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "../../components/SectionTitle";
import SKeletonLoader from "../../components/SKeletonLoader";

const StatisticsSection = () => {
	const axiosPublic = useAxiosPublic();
	const { data: stats = {}, isLoading } = useQuery({
		queryKey: ["statistics"],
		queryFn: async () => {
			const res = await axiosPublic.get("/statistics");
			return res.data;
		},
	});

	if (isLoading) {
		return <SKeletonLoader></SKeletonLoader>;
	}

	return (
		<div className="py-8">
			<SectionTitle h1="Statistics" />
			<div className="flex justify-around">
				<div>
					<h2>Total Users</h2>
					<CountUp end={stats.totalUsers} />
				</div>
				<div>
					<h2>Normal Users</h2>
					<CountUp end={stats.normalUsers} />
				</div>
				<div>
					<h2>Premium Users</h2>
					<CountUp end={stats.premiumUsers} />
				</div>
			</div>
		</div>
	);
};

export default StatisticsSection;
