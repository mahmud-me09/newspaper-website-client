import DateToday from "./DateToday";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const Navbar = () => {
	const { user, handleSignOut } = useContext(AuthContext);

	const navlinkItems = [
		{
			name: "Home",
			path: "/",
		},
		{
			name: "All Articles",
			path: "/articles",
		},
		{
			name: "Premium Articles",
			path: "/premiumarticles",
		},
		{
			name: "Subscription",
			path: "/subscription",
		},
		{
			name: "Dashboard",
			path: "/admin/dashboard",
		},
		{
			name: "My Articles",
			path: "/myarticles",
		},
	];

	return (
		<div>
			<div className=" text-center py-4 border-b-4 border-double ">
				<h3 className="text-3xl font-bold text-poppins text-red-700 italic">
					The
				</h3>
				<h1 className="text-3xl font-oldStandardTT italic uppercase font-bold">
					Morning Tribune
				</h1>
				<DateToday></DateToday>
			</div>
			{/* Navlinks */}
			<div className="navbar z-20 border-b-4 border-double sticky top-0">
				<div className="navbar-start pl-10">
					<div className="dropdown">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost lg:hidden"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm gap-2 dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							{navlinkItems.map((navlink) => (
								<li
									key={navlink.name}
									className="relative group"
								>
									<NavLink
										to={navlink.path}
										className={({ isActive }) =>
											isActive
												? "text-red-700 bg-gray-100 border-b border-red-700"
												: "text-gray-800 transition-colors duration-300 group-hover:text-red-700"
										}
									>
										{navlink.name}
										<span className="absolute left-0 right-0 bottom-0 w-full bg-red-700 h-0.5 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
									</NavLink>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="flex flex-row gap-2 px-2">
						{navlinkItems.map((navlink) => (
							<li
								className="font-normal relative group"
								key={navlink.name}
							>
								<NavLink
									className={({ isActive }) =>
										isActive
											? "scale-105 font-bold ml-4 flex items-center gap-2 justify-center relative"
											: "hover:scale-105 hover:font-bold ml-4 gap-2 flex items-center justify-center relative"
									}
									to={navlink.path}
								>
									{navlink.name}
									{/* Underline animation */}
									<span className="absolute left-0 right-0 bottom-0 w-full bg-red-700 h-0.5 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
								</NavLink>
							</li>
						))}
					</ul>
				</div>
				<div className="navbar-end pr-10">
					{user ? (
						<div className="dropdown dropdown-end">
							<div
								tabIndex={0}
								role="button"
								className="avatar btn btn-circle tooltip z-50 tooltip-left"
								data-tip={`${user?.displayName}`}
							>
								<div className="w-10 rounded-full">
									<img
										alt="User Image"
										src={user?.photoURL}
									/>
								</div>
							</div>

							<ul
								tabIndex={0}
								className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52 relative"
							>
								<li>
									<Link
										to="/myarticles"
										className="text-gray-800 transition-colors duration-300 relative group"
									>
										My Articles
										{/* Underline animation */}
										<span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
									</Link>
								</li>
								<li>
									<Link
										to="/addArticle"
										className="text-gray-800 transition-colors duration-300 relative group"
									>
										Add Article
										{/* Underline animation */}
										<span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
									</Link>
								</li>
								<li>
									<Link
										to="/subscription"
										className="text-gray-800 transition-colors duration-300 relative group"
									>
										Subscription
										{/* Underline animation */}
										<span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
									</Link>
								</li>
								<li>
									<Link
										to="admin/dashboard"
										className="text-gray-800 transition-colors duration-300 relative group"
									>
										My Dashboard
										{/* Underline animation */}
										<span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-700 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
									</Link>
								</li>
								<li>
									<button
										onClick={handleSignOut}
										className="text-gray-800 transition-colors duration-300 relative group hover:bg-red-700 hover:text-white"
									>
										Logout
									</button>
								</li>
							</ul>
						</div>
					) : (
						<Link
							className="btn btn-outline btn-success"
							to="/login"
						>
							Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
