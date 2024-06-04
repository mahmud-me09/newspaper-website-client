import axios from "axios";
export const instance = axios.create({
	// baseURL: "https://newspaper-website-server.vercel.app",
    baseURL:"http://localhost:5000",
});

const useAxiosSecure = () => {
    return instance
};

export default useAxiosSecure;