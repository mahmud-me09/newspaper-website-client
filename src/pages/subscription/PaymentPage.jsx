import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";
import SectionTitle from "../../components/SectionTitle";


const stripePromise = loadStripe(import.meta.env.VITE_Publishable_Key);
const PaymentPage = () => {
	const location = useLocation()
	const {subscriptionPeriod, price} = location.state
	return (
		<div>
			<SectionTitle h1={"Confirmation of Payment"} />
			<div>
				<Elements stripe={stripePromise}>
					<CheckoutForm
						price={price}
						subscriptionPeriod={subscriptionPeriod}
					></CheckoutForm>
				</Elements>
			</div>
		</div>
	);
};

export default PaymentPage;
