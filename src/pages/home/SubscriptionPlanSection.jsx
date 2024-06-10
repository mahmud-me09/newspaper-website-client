import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle';

const SubscriptionPlanSection = () => {
        const navigate = useNavigate();

    return (
		<div className="py-8">
			<SectionTitle h1="Plans" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
				<div className="card border border-gray-200 p-4 shadow-lg flex flex-col relative">
					<div className="absolute top-2 right-2 text-lg font-bold text-red-500">
						$1
					</div>
					<h2 className="text-xl font-bold mb-2">$1 Plan</h2>
					<p className="mb-4">Free for One Minutes</p>
					<ul className="list-disc list-inside mb-4 flex-grow">
						<li>Access to basic articles</li>
						<li>Weekly newsletter</li>
						<li>Basic support</li>
					</ul>
					<button
						onClick={() =>
							navigate("/subscription", {
								state: { price: 1, period: 1 },
							})
						}
						className="btn btn-primary mt-auto"
					>
						Subscribe
					</button>
				</div>
				<div className="card border border-gray-200 p-4 shadow-lg flex flex-col relative">
					<div className="absolute top-2 right-2 text-lg font-bold text-red-500">
						$10
					</div>
					<h2 className="text-xl font-bold mb-2">
						5 days Premium Plan
					</h2>
					<p className="mb-4"> Premium for 5 days </p>
					<ul className="list-disc list-inside mb-4 flex-grow">
						<li>Access to all articles</li>
						<li>Daily newsletter</li>
						<li>Priority support</li>
						<li>No ads</li>
					</ul>
					<button
						onClick={() =>
							navigate("/subscription", {
								state: { price: 10, period: 5 },
							})
						}
						className="btn btn-primary mt-auto"
					>
						Subscribe
					</button>
				</div>
				<div className="card border border-gray-200 p-4 shadow-lg flex flex-col relative">
					<div className="absolute top-2 right-2 text-lg font-bold text-red-500">
						$20
					</div>
					<h2 className="text-xl font-bold mb-2">
						10 days Premium Plan
					</h2>
					<p className="mb-4">Premium for 10 days</p>
					<ul className="list-disc list-inside mb-4 flex-grow">
						<li>Access to all articles</li>
						<li>Daily newsletter</li>
						<li>Priority support</li>
						<li>No ads</li>
						<li>Exclusive content</li>
					</ul>
					<button
						onClick={() =>
							navigate("/subscription", {
								state: { price: 20, period: 10 },
							})
						}
						className="btn btn-primary mt-auto"
					>
						Subscribe
					</button>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionPlanSection;