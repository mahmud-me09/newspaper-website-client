import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:5000",
	// baseURL: "https://newspaper-website-server.vercel.app"
});
const useAxiosPublic = () => {
	return instance;
};

export default useAxiosPublic;
