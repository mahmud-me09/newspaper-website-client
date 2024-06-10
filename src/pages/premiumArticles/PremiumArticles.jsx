import useAxiosPublic from "../../hooks/useAxiosPublic";
import SectionTitle from "../../components/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../../components/SKeletonLoader";
import { useNavigate } from "react-router-dom";

const PremiumArticles = () => {
	const axiosPublic = useAxiosPublic();
	const navigate = useNavigate();

	const { data: articles = [], isLoading } = useQuery({
		queryKey: ["articles"],
		queryFn: async () => {
			const res = await axiosPublic.get(`/articles?isPremium=${true}`);
			console.log(res.data);
			return res.data;
		},
	});

	return (
		<>
			<div className="py-4 mr-8">
				<SectionTitle h1={"All Articles"}></SectionTitle>
			</div>
			{isLoading ? (
				<SkeletonLoader></SkeletonLoader>
			) : (
				<>
					<div></div>
					<div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-4">
						{articles.map((article) => (
							<div
								key={article._id}
								className={`card max-w-1/2 border ${
									article.isPremium
										? "bg-amber-100 border-amber-200"
										: "bg-base-100"
								} shadow-xl`}
							>
								<h2 className=" card card-title mt-10 ">
									{article.name}
								</h2>
								<p className="text-center mb-3">
									Publisher: {article?.publisher}
								</p>
								<figure className="px-10 ">
									<img
										src={article.image}
										alt="article"
										className="rounded-xl border-2 shadow-lg shadow-orange-950 w-full h-96"
									/>
								</figure>

								<div className="card card-body items-start text-center">
									<div className="w-full flex justify-between">
										<p className="text-left">
											Author: {article?.author?.name}
										</p>
										<p className="italic text-right">
											{article?.createdAt?.split("T")[0]}
										</p>
									</div>

									<div className="card-actions w-full">
										<p className="text-justify">
											{article.description
												.split(/[.?!]\s+/)
												.slice(0, 3)
												.join(". ") + "."}
										</p>
									</div>
									<div className="card-actions w-full py-2 justify-end">
										<button
											onClick={() => {
												navigate(
													`/articles/${article._id}`
												);
												axiosPublic
													.patch(
														`/articledetail/${article._id}`,
														{
															$inc: {
																viewCount: 1,
															},
														}
													)
													.then((res) => {
														console.log(res.data);
													})
													.catch((error) => {
														console.log(
															error.message
														);
													});
											}}
											className="btn btn-outline "
										>
											Detail
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	);
};

export default PremiumArticles;
