import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle";
import Banner from "./Banner"

const SubscriptionPage = () => {
	const location = useLocation();
    const navigate = useNavigate()
	const [subscriptionPeriod, setSubscriptionPeriod] = useState(1);
	const [price, setPrice] = useState(location.state?.price || 1);

	  useEffect(() => {
			const { period } = location.state || { price: 1, period: 1 };
			setSubscriptionPeriod(period);
			setPrice(location.state?.price || 1);
		}, [location.state]);
    


	const handlePeriodChange = (event) => {
		const selectedPeriod = parseInt(event.target.value);
		setSubscriptionPeriod(selectedPeriod);

		if (selectedPeriod === 1) {
			setPrice(1);
		} else if (selectedPeriod === 5) {
			setPrice(10);
		} else if (selectedPeriod === 10) {
			setPrice(20);
		}
	};

	return (
		<div className="py-8">
			<Banner />
			<div className="my-4">
				<SectionTitle h1="Subscription" />
			</div>
			<div className="max-w-7xl flex flex-col justify-center items-center">
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">
						Select Subscription Period
					</h2>
					<div className="flex items-center space-x-4">
						<select
							className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
							onChange={handlePeriodChange}
							value={subscriptionPeriod}
						>
							<option value={1}>
								1 minute (for assignment checking)
							</option>
							<option value={5}>5 days</option>
							<option value={10}>10 days</option>
						</select>
						<div className="font-bold border py-1.5 px-3 rounded-lg text-xl">${price}</div>
					</div>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">
						Subscription Details
					</h2>
					<div className="p-4 max-w-96 border border-gray-200 rounded-md shadow-lg">
						<h3 className="text-lg font-semibold mb-2">
							{subscriptionPeriod}{" "}
							{subscriptionPeriod === 1 ? "minute" : "days"}{" "}
							Premium Plan
						</h3>
						<p className="mb-4">
							Access to all articles, daily newsletter, priority
							support, no ads.
						</p>
						<button
							className={`btn btn-primary
							}`}
							onClick={() =>
								navigate("/payment", {
									state: {
										subscriptionPeriod,
										price,
									},
								})
							}
						>
							checkout now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionPage;
