import img from "../../assets/Articles/barcaWins.jpeg"

const Banner = () => {
	return (
		<div className="relative bg-blue-500 h-64">
			<div className="absolute inset-0 overflow-hidden">
				<img
					className="object-cover w-full h-full"
					src={img}
					alt="Subscription Banner"
				/>
				<div className="absolute inset-0 bg-blue-900 opacity-50"></div>
			</div>
			<div className="relative flex items-center justify-center h-full">
				<div className="text-center text-white">
					<h1 className="text-4xl font-bold mb-4">
						Premium Subscription
					</h1>
					<p className="text-xl">
						Enjoy exclusive features and benefits
					</p>
				</div>
			</div>
		</div>
	);
};

export default Banner;