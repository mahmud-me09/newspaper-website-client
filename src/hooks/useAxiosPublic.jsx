import axios from "axios";

const instance = axios.create({
	baseURL: "https://newspaper-website-server.vercel.app"
});
const useAxiosPublic = () => {
	return instance;
};

export default useAxiosPublic;
