import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PublicRoot from '../root/PublicRoot';
import AdminRoot from '../root/AdminRoot';
import Home from '../pages/home/Home';
import LoginPage from '../pages/login/LoginPage';
import RegistrationPage from '../pages/registration/RegistrationPage';
import Error from '../pages/errorPage/Error';
import AddArticlesPage from '../pages/addArticles/AddArticlesPage';
import PrivateRouter from "./PrivateRouter"
import Dashboard from '../adminPages/Dashboard';
import AllArticlesPage from '../adminPages/AllArticlesPage';
import AllUsersPage from '../adminPages/AllUsersPage';
import AddPublisher from '../adminPages/AddPublisher';

const Router = () => {
    const router = createBrowserRouter([
		{
			path: "/",
			element: <PublicRoot></PublicRoot>,
			errorElement: <Error></Error>,
			children: [
				{
					path: "",
					element: <Home></Home>,
				},
				{
					path: "login",
					element: <LoginPage></LoginPage>,
				},
				{
					path: "register",
					element: <RegistrationPage></RegistrationPage>,
				},
				{
					path: "addArticle",
					element: (
						<PrivateRouter>
							<AddArticlesPage></AddArticlesPage>
						</PrivateRouter>
					),
				},
			],
		},
		{
			path: "/admin/",
			element: <AdminRoot></AdminRoot>,
			errorElement: <p>You are not authorized</p>,
			children: [
				{
					path: "dashboard",
					element: <Dashboard></Dashboard>,
				},
				{
					path: "allarticles",
					element: <AllArticlesPage></AllArticlesPage>,
				},
				{
					path: "allusers",
					element: <AllUsersPage></AllUsersPage>,
				},
				{
					path: "addpublisher",
					element: <AddPublisher></AddPublisher>,
				},
			],
		},
	]);
    return <RouterProvider router={router} />;
};

export default Router;