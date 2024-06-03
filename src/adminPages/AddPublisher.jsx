import axios from 'axios';
import SectionTitle from '../components/SectionTitle';
import useAxiosSecure from '../hooks/useAxiosSecure';

const imageHostingKey = import.meta.env.VITE_imgbb_API;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const AddPublisher = () => {
    const axiosSecure = useAxiosSecure()
    const handlePublisher = async(event)=>{
        event.preventDefault()
        const form = event.target
        const res = await axios.post(imageHostingAPI, {image:form.logo.files[0]},{
			headers:{
				"Content-Type":"multipart/form-data"
			}
		})
        const publisher = form.publisher.value
        const publisherLogo = res.data.data.display_url;
        const publisherInfo ={
            publisher,
            publisherLogo
        }
        axiosSecure.post('/publisher', publisherInfo)
        .then(res=>console.log(res.data.insertedId))
        .catch(error=> console.log(error.message))
    }
    return (
		<div className='flex h-screen mx-auto justify-center items-center'>
			<form
				className="mr-4 pr-4 w-fit"
				onSubmit={handlePublisher}
			>
				<div className='mb-5'>
					<SectionTitle h1={"Add Publisher Here"}></SectionTitle>
				</div>
				<div>
					<label htmlFor="name" className="text-sm">
						Publisher Name:
					</label>
					<input
						name="publisher"
						type="text"
						placeholder="Write Publisher Name here"
						className="w-full rounded-md p-4 border border-green-300"
					/>
				</div>
				<div>
					<label htmlFor="name" className="text-sm">
						Publisher Logo:
					</label>
					<input
						name="logo"
						type="file"
						placeholder="Publisher Logo upload here"
						className="w-full rounded-md p-4 border border-green-300"
					/>
				</div>
				<div className="mt-6">
					<input
						type="submit"
						value="Add Publisher"
						className="w-full btn btn-success btn-outline rounded-md p-4 border border-green-300"
					/>
				</div>
			</form>
		</div>
	);
};

export default AddPublisher;