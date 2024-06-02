import axios from "axios";
export const instance =  axios.create({
    baseURL: 'http://localhost:5000'
})

const useAxiosSecure = () => {
    return instance
};

export default useAxiosSecure;