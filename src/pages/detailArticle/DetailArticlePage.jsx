import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SKeletonLoader from "../../components/SKeletonLoader";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Markdown from "react-markdown";

const DetailArticlePage = () => {
	const { id } = useParams();
	console.log(id);
	const axiosPublic = useAxiosPublic();

	const {
		data: article,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["article", id],
		queryFn: async () => {
			const res = await axiosPublic.get(`articledetail/${id}`);
			return res.data;
		},
	});

	return (
		<div className="my-8">
			{isLoading ? (
				<SKeletonLoader></SKeletonLoader>
			) : (
				<>
					<h1 className="text-3xl text-center">{article?.name}</h1>

					<div className="flex justify-between my-4">
						<div className="flex items-center gap-2">
							<img
								className="w-12 h-12 rounded-full"
								src={article?.author?.photo}
								alt=""
							/>
							<div>
								<p>Author: {article?.author?.name}</p>
								<p>contact: {article?.author?.email}</p>
							</div>
						</div>
						<p>
							Published Date: {article?.createdAt?.split("T")[0]}
						</p>
					</div>
					<div className="my-4">
						<img
							className="w-full max-h-[500px]"
							src={article.image}
							alt=""
						/>
						<p className="w-full bg-slate-100 p-2 my-2 rounded-md">
							Photo Credit: Anonymous
						</p>
					</div>
					<div>
						<Markdown>{article?.description}</Markdown>
					
					</div>
				</>
			)}
		</div>
	);
};

export default DetailArticlePage;
