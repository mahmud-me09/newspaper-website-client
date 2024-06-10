import React from "react";
import img from "../../assets/aboutus.jpeg"
import SectionTitle from "../../components/SectionTitle";

const AboutUs = () => {
	return (
		<section className="py-16">
			<SectionTitle h1={"About Morning Tribune"} />
			<div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
				<div className="lg:w-1/2 lg:pr-8 mb-10 lg:mb-0">
					<p className="text-lg text-gray-700 text-justify dark:text-gray-300 leading-relaxed">
						Morning Tribune is your trusted source for breaking
						news, analysis, exclusive interviews, and in-depth
						coverage of politics, business, sports, entertainment,
						technology, health, and more.
					</p>
					<p className="text-lg text-gray-700 text-justify dark:text-gray-300 leading-relaxed mt-4">
						Established with a commitment to journalistic integrity
						and excellence, our mission is to deliver accurate and
						engaging content to our global audience. We pride
						ourselves on providing timely and reliable news updates
						that matter most to you.
					</p>
				</div>

				<div className="lg:w-1/2 lg:pl-8">
					<img
						src={img}
						alt="About Us"
						className="rounded-lg shadow-lg"
					/>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
