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
			<section className="p-6 bg-gray-100 dark:bg-gray-800">
				<div className="container mx-auto">
					<h2 className="text-3xl font-semibold mb-4 text-center">
						Our Statistics
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-white shadow-md p-6 rounded-md">
							<h3 className="text-xl font-semibold mb-4">
								Total Users
							</h3>
							<p className="text-4xl font-bold text-gray-800">
								<CountUp end={stats.totalUsers} />
							</p>
						</div>
						<div className="bg-white shadow-md p-6 rounded-md">
							<h3 className="text-xl font-semibold mb-4">
								Normal Users
							</h3>
							<p className="text-4xl font-bold text-gray-800">
								<CountUp end={stats.normalUsers}/>
							</p>
						</div>
						<div className="bg-white shadow-md p-6 rounded-md">
							<h3 className="text-xl font-semibold mb-4">
								Premium Users
							</h3>
							<p className="text-4xl font-bold text-gray-800">
								<CountUp end={stats.premiumUsers} />
							</p>
						</div>
					</div>
				</div>
			</section>
			
		</div>
	);
};

export default StatisticsSection;
