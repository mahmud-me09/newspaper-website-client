import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart } from "react-google-charts";
import axios from "axios";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Dashboard = () => {
	const axiosSecure = useAxiosSecure();

	const { data: articles = [] } = useQuery({
		queryKey: ["articles", "all"],
		queryFn: async () => {
			const res = await axiosSecure.get("/articles");
			return res.data;
		},
	});

	console.log(articles);

	const { data: publisherArticles = [], isLoading: articlesLoading } =
		useQuery({
			queryKey: ["publisherArticles"],
			queryFn: async () => {
				const response = await axiosSecure.get(
					"/publisher/articles/count"
				);
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
	console.log("all Articles", articles);

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

			{/* Static Charts - Example: Bar Chart and Line Chart */}
			<div className="grid grid-cols-2 gap-8">
				<div>
					<h2 className="text-lg font-semibold mb-2">
						Bar Chart: Example
					</h2>
					<Chart
						chartType="BarChart"
						loader={<div>Loading Chart...</div>}
						data={[
							["City", "2010 Population", "2000 Population"],
							["New York City, NY", 8175000, 8008000],
							["Los Angeles, CA", 3792000, 3694000],
							["Chicago, IL", 2695000, 2896000],
							["Houston, TX", 2099000, 1953000],
							["Philadelphia, PA", 1526000, 1517000],
						]}
						options={{
							title: "Population of Largest U.S. Cities",
							chartArea: { width: "50%" },
							hAxis: {
								title: "Total Population",
								minValue: 0,
							},
							vAxis: {
								title: "City",
							},
						}}
						rootProps={{ "data-testid": "2" }}
					/>
				</div>
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
						hAxis: { title: "premium and non-premium articles" },
						vAxis: { title: "Number of Articles" },
					}}
					rootProps={{ "data-testid": "5" }}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
