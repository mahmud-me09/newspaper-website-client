import { useEffect, useState } from "react";
import AllPublishersSection from "./AllPublishersSection";
import StatisticsSection from "./StatisticsSection";
import SubscriptionPlanSection from "./SubscriptionPlanSection";
import TrendingArticles from "./TrendingArticles";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAdmin from "../../hooks/useAdmin";
import usePremium from "../../hooks/usePremium";
import UsersFeedback from "./UsersFeedback";
import AboutUs from "./AboutUs";



const Home = () => {
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const {user} = useAuth()
	const [isAdmin] = useAdmin()
	const [isPremium] = usePremium()

	useEffect(() => {
		if (user && !isAdmin && !isPremium) {
			const timer = setTimeout(() => {
				setShowModal(true);
			}, 10000);

			return () => clearTimeout(timer);
		}
	}, [user, isPremium]);

	useEffect(() => {
		if (showModal) {
			Swal.fire({
				title: `Hey ${user.displayName}!`,
				text: `Do you want to get access to premium content?\nSubscribe Now.`,
				icon: "info",
				showCancelButton: true,
				confirmButtonText: "Subscribe",
				cancelButtonText: "Later",
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/subscription");
				}
			});
		}
	}, [showModal, navigate]);

	return (
		<div>
			<TrendingArticles />
			<AllPublishersSection />
			<StatisticsSection />
			<SubscriptionPlanSection />
			<AboutUs/>
			<UsersFeedback/>

		</div>
	);
};

export default Home;
