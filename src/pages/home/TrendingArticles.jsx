import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import SectionTitle from "../../components/SectionTitle";
import usePremium from "../../hooks/usePremium";
import Slider from "react-slick";
import SKeletonLoader from "../../components/SKeletonLoader";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const TrendingArticles = () => {
	const axiosPublic = useAxiosPublic();
	const navigate = useNavigate()
	const [isPremium] = usePremium();
	const { data: articles = [], isLoading } = useQuery({
		queryKey: ["trendingArticles"],
		queryFn: async () => {
			const res = await axiosPublic.get(
				"/articles?isApproved=true&sortBy=viewCount&limit=6"
			);
			return res.data;
		},
	});

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	if (isLoading) {
		return <SKeletonLoader></SKeletonLoader>;
	}

	return (
		<div className="py-8">
			<SectionTitle h1="Trending Articles" />
			<Slider {...settings}>
				{articles.map((article) => (
					<div key={article._id} className="p-4">
						<div
							className={`max-w-1/4 h-[660px] border ${
								article?.isPremium
									? "bg-amber-100 border-amber-200"
									: "bg-base-100"
							} shadow-xl rounded-2xl flex flex-col`}
						>
							<h2 className=" card card-title text-center mt-10 px-10">
								{article?.name}
							</h2>
							<p className="text-center mb-3">
								Publisher: {article?.publisher}
							</p>
							<figure className="px-10 ">
								<img
									src={article?.image}
									alt="article"
									className="rounded-xl border-2 shadow-lg shadow-orange-950 w-full h-48"
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

								<div className="card-actions w-full flex-grow">
									<p className="text-justify ">
										{article?.description
											.split(/[.?!]\s+/)
											.slice(0, 1)
											.join(". ") + "."}
									</p>
								</div>
								<div className="card-actions w-full py-2 justify-end">
									<button
										disabled={
											!isPremium && article?.isPremium
										}
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
													console.log(error.message);
												});
										}}
										className="btn btn-outline "
									>
										Detail
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default TrendingArticles;
