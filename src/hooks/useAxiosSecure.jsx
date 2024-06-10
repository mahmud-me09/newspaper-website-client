import axios from "axios";
export const instance = axios.create({
	baseURL: "https://newspaper-website-server.vercel.app",
   
});

const useAxiosSecure = () => {
    return instance
};

export default useAxiosSecure;