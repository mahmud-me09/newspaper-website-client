import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart } from "react-google-charts";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Dashboard = () => {
	const axiosPublic = useAxiosPublic();

	const { data: articles = [] } = useQuery({
		queryKey: ["articles", "all"],
		queryFn: async () => {
			const res = await axiosPublic.get("/articles");
			return res.data;
		},
	});


	const { data: publisherArticles = [], isLoading: articlesLoading } =
		useQuery({
			queryKey: ["publisherArticles"],
			queryFn: async () => {
				const response = await axiosPublic.get(
					"/publisher/articles/count"
				);
				return response.data;
			},
		});

	const { data: publisherViewCount = [], isLoading: viewCountLoading } =
		useQuery({
			queryKey: ["publisherViewCount"],
			queryFn: async () => {
				const response = await axiosPublic.get("/publisher/viewcount");
				return response.data;
			},
		});

	// Calculate percentages for pie chart
	const calculatePieChartData = () => {
		if (publisherArticles.length === 0) {
			return [["Publisher", "Percentage"]];
		}

		const data = [["Publisher", "Percentage"]];
		const totalArticles = publisherArticles.reduce(
			(acc, curr) => acc + curr.count,
			0
		);

		publisherArticles.forEach((item) => {
			const percentage = (item.count / totalArticles) * 100;
			data.push([item._id, percentage]);
		});

		return data;
	};

	const calculateLineChartData = () => {
		if (publisherViewCount.length === 0) {
			return [["Publisher", "View Count"]];
		}

		const data = [["Publisher", "View Count"]];

		publisherViewCount.forEach((item) => {
			data.push([item._id, item.totalViewCount]);
		});

		return data;
	};

	return (
		<div className="container mx-auto mt-8">
			<h1 className="text-xl lg:text-4xl text-center max-w-full mb-4">
				Admin Dashboard
			</h1>

			{/* Dynamic Pie Chart */}
			<div className="mb-8">
				<h2 className="text-lg text-center font-semibold mb-2">
					Pie Chart: Article Distribution by Publisher
				</h2>
				<Chart
					chartType="PieChart"
					loader={<div>Loading Chart...</div>}
					data={calculatePieChartData()}
					options={{
						title: "Article Distribution by Publisher",
						is3D: true,
					}}
					rootProps={{ "data-testid": "1" }}
				/>
			</div>

			<div className="grid grid-cols-1 gap-8">
				<div className="mb-8">
					<h2 className="text-lg text-center font-semibold mb-2">
						Line Chart: Publisher vs View Count
					</h2>
					{/* Line Chart: Publisher vs View Count */}
					<Chart
						chartType="LineChart"
						loader={<div>Loading Chart...</div>}
						data={calculateLineChartData()}
						options={{
							title: "Publisher vs View Count",
							hAxis: { title: "Publisher" },
							vAxis: { title: "View Count" },
						}}
						rootProps={{ "data-testid": "3" }}
					/>
				</div>
				<div className="mb-8">
					<h2 className="text-lg text-center font-semibold mb-2">
						Bar Chart: Premium and Non-Premium Vs Number of Articles
					</h2>
					{/* premium vs non-premium */}
					<Chart
						chartType="ColumnChart"
						loader={<div>Loading Chart...</div>}
						data={[
							["Type", "Count"],
							[
								"Premium Articles",
								articles.filter((article) => article.isPremium)
									.length,
							],
							[
								"Non-Premium Articles",
								articles.filter((article) => !article.isPremium)
									.length,
							],
						]}
						options={{
							title: "Premium vs. Non-Premium Articles",
							chartArea: { width: "60%", height: "70%" },
							hAxis: {
								title: "premium and non-premium articles",
							},
							vAxis: { title: "Number of Articles" },
						}}
						rootProps={{ "data-testid": "5" }}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
