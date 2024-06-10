import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionTitle from "../../components/SectionTitle";
import SKeletonLoader from "../../components/SKeletonLoader";

const AllPublishersSection = () => {
	const axiosPublic = useAxiosPublic();
	const { data: publishers = [], isLoading } = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			const res = await axiosPublic.get("/publisher");
			return res.data;
		},
	});

	if (isLoading) {
		return <SKeletonLoader></SKeletonLoader>;
	}
	return (
		<div className="py-8">
			<SectionTitle h1="All Publishers" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4">
				{publishers.map((publisher) => (
					<div
						key={publisher._id}
						className="flex items-center gap-2 border"
					>
						<img
							className="w-10 h-10"
							src={publisher.publisherLogo}
							alt=""
						/>
						<h2>{publisher.publisher}</h2>
					</div>
				))}
			</div>
		</div>
	);
};

export default AllPublishersSection;
