import axios from "axios";

const imageHostingKey = import.meta.env.VITE_imgbb_API;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const useImageHosting = async (imagefile) => {
    const res = await axios.post(
			imageHostingAPI,
			{ image: imagefile },
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
    const image = res.data.data.display_url;
	return image;
};

export default useImageHosting;
