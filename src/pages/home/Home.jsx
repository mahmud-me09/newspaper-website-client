import AllPublishersSection from "./AllPublishersSection";
import StatisticsSection from "./StatisticsSection";
import SubscriptionPlanSection from "./SubscriptionPlanSection";
import TrendingArticles from "./TrendingArticles";



const Home = () => {
	return (
		<div>
			<TrendingArticles />
			<AllPublishersSection />
			<StatisticsSection />
			<SubscriptionPlanSection />

		</div>
	);
};

export default Home;
