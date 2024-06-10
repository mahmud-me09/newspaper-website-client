import React, { useState } from "react";
import Swal from "sweetalert2";

const UsersFeedback = () => {
	const [feedback, setFeedback] = useState("");
	const [feedbackList, setFeedbackList] = useState([]);

	const handleSubmit = (event) => {
		event.preventDefault();

		// Simulate a loading state
		Swal.fire({
			title: "Submitting Feedback...",
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
				// Simulate server response delay
				setTimeout(() => {
					Swal.close();
					const newFeedback = {
						id: new Date().getTime(), // Generate a unique ID (timestamp)
						message: feedback,
					};
					setFeedbackList([newFeedback, ...feedbackList]);
					setFeedback("");
					Swal.fire({
						icon: "success",
						title: "Feedback Submitted!",
						text: "Thank you for your valuable feedback.",
					});
				}, 2000); // Simulate 2 seconds delay
			},
		});
	};

	return (
		<section className="p-6 bg-gray-100 dark:bg-gray-900">
			<div className="container mx-auto">
				<h2 className="text-3xl font-semibold mb-4 text-center">
					User Feedback
				</h2>
				<form onSubmit={handleSubmit} className="max-w-lg mx-auto">
					<textarea
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						placeholder="Your feedback..."
						className="w-full h-32 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
					/>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
					>
						Submit Feedback
					</button>
				</form>
				<div className="mt-8">
					{feedbackList.length > 0 ? (
						<ul className="space-y-4">
							{feedbackList.map((item) => (
								<li
									key={item.id}
									className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-300 dark:border-gray-700"
								>
									<p className="text-gray-800 dark:text-gray-200">
										{item.message}
									</p>
								</li>
							))}
						</ul>
					) : (
						<p className="text-center text-gray-600 dark:text-gray-400">
							No feedback yet.
						</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default UsersFeedback;
