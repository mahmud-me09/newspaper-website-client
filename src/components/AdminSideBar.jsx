import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminSideBar = () => {
	const { handleSignOut, user } = useAuth();
	return (
		<div className=" p-3 space-y-2 w-72 h-fit lg:h-screen bg-red-50">
			<Link to="/admin/dashboard">
				<div className="flex flex-col lg:flex-row items-center p-2 space-x-1 lg:space-x-4">
					<img
						src={user?.photoURL}
						alt=""
						className="w-12 h-12 rounded-full dark:bg-gray-500"
					/>
					<div>
						<h2 className="text-lg font-semibold">
							{user?.displayName}
						</h2>
						<p>Role: Admin</p>
					</div>
				</div>
			</Link>
			<div className="divide-y dark:divide-gray-300">
				<ul className="pt-2 pb-4 space-y-1 text-sm">
					<li className="dark:bg-gray-100 dark:text-gray-900">
						<Link
							to="/"
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>Home</span>
						</Link>
					</li>
					<li className="dark:bg-gray-100 dark:text-gray-900">
						<Link
							to="/admin/dashboard"
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>Admin Home</span>
						</Link>
					</li>
					<li className="dark:bg-gray-100 dark:text-gray-900">
						<Link
							to="/admin/allusers"
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>All Users</span>
						</Link>
					</li>
					<li>
						<Link
							to="/admin/allarticles"
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>All Articles</span>
						</Link>
					</li>
					<li>
						<Link
							to="/admin/addpublisher"
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>Add Publishers</span>
						</Link>
					</li>
					<li>
						<button
							onClick={handleSignOut}
							className="flex items-center p-2 space-x-3 rounded-md"
						>
							<span>Logout</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default AdminSideBar;
