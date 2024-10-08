import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckoutForm = ({ subscriptionPeriod, price }) => {
	const [error, setError] = useState("");
	const [clientSecret, setClientSecret] = useState("");
	const [transactionId, setTransactionId] = useState("");
	const stripe = useStripe();
	const elements = useElements();
	const axiosPublic = useAxiosPublic();
	const { user } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		if (price >= 0) {
			axiosPublic
				.post("/create-payment-intent", { price: price })
				.then((res) => {
					// console.log(res.data.clientSecret);
					setClientSecret(res.data.clientSecret);
				});
		}
	}, [axiosPublic, price]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const card = elements.getElement(CardElement);

		if (card === null) {
			return;
		}

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card,
		});

		if (error) {
			console.log("payment error", error);
			setError(error.message);
		} else {
			console.log("payment method", paymentMethod);
			setError("");
		}

		// confirm payment
		const { paymentIntent, error: confirmError } =
			await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card,
					billing_details: {
						email: user?.email || "anonymous",
						name: user?.displayName || "anonymous",
					},
				},
			});

		if (confirmError) {
			console.log("confirm error");
		} else {
			console.log("payment intent", paymentIntent);
			if (paymentIntent.status === "succeeded") {
				console.log("transaction id", paymentIntent.id);
				setTransactionId(paymentIntent.id);

				const currentDate = new Date();
				let expiredDate = new Date(currentDate);

				if (subscriptionPeriod === 1) {
					expiredDate.setMinutes(currentDate.getMinutes() + 1);
				} else if (subscriptionPeriod === 5) {
					expiredDate.setDate(currentDate.getDate() + 5);
				} else if (subscriptionPeriod === 10) {
					expiredDate.setDate(currentDate.getDate() + 10);
				}

				const payment = {
					price: price,
					transactionId: paymentIntent.id,
					date: new Date(), // UTC date
					expiredDate: expiredDate.toISOString(),
				};

				const res = await axiosPublic.put(
					`/payment?email=${user.email}`,
					{
						subscriptionHistory: payment,
						isPremium: true,
					}
				);
				console.log("payment saved", res.data);
				if (res.data?.modifiedCount > 0) {
					Swal.fire({
						position: "top-end",
						icon: "success",
						title: "Thank you for the payment",
						showConfirmButton: false,
						timer: 1500,
					});
					navigate("/");
				}
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-red-50 w-96 p-10 my-5 mx-auto"
		>
			<h1 className="py-5 text-center text-lg font-bold">
				Pay ${price} for {subscriptionPeriod}{" "}
				{subscriptionPeriod === 1 ? "min" : "day"} Subscription
			</h1>
			<CardElement
				options={{
					style: {
						base: {
							fontSize: "16px",
							color: "#424770",
							backgroundColor: "white",

							"::placeholder": {
								color: "#aab7c4",
							},
						},
						invalid: {
							color: "#9e2146",
						},
					},
				}}
			/>
			<button
				className="btn btn-primary my-4 btn-block"
				type="submit"
				disabled={!stripe || !clientSecret}
			>
				Pay
			</button>
			<p className="text-red-600">{error}</p>
			{transactionId && (
				<p className="text-green-600">
					{" "}
					Your transaction id: {transactionId}
				</p>
			)}
		</form>
	);
};

export default CheckoutForm;
