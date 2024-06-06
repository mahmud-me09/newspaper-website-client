import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AddPublisher from "../adminPages/AddPublisher";
import AllArticlesPage from "../adminPages/AllArticlesPage";
import AllUsersPage from "../adminPages/AllUsersPage";
import Dashboard from "../adminPages/Dashboard";
import AddArticlesPage from "../pages/addArticles/AddArticlesPage";
import DetailArticlePage from "../pages/detailArticle/DetailArticlePage";
import Error from "../pages/errorPage/Error";
import Home from "../pages/home/Home";
import LoginPage from "../pages/login/LoginPage";
import MyArticles from "../pages/myArticles/MyArticles";
import RegistrationPage from "../pages/registration/RegistrationPage";
import AdminRoot from "../root/AdminRoot";
import PublicRoot from "../root/PublicRoot";
import PrivateRouter from "./PrivateRouter";
import UpdateArticle from "../pages/updateArticle/UpdateArticle";

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
					path: "articles/:id",
					element: <DetailArticlePage></DetailArticlePage>,
				},
				{
					path: "addArticle",
					element: (
						<PrivateRouter>
							<AddArticlesPage></AddArticlesPage>
						</PrivateRouter>
					),
				},
				{
					path: "updateArticle",
					element: (
						<PrivateRouter>
							<UpdateArticle></UpdateArticle>
						</PrivateRouter>
					),
				},
				{
					path: "myarticles",
					element: (
						<PrivateRouter>
							<MyArticles></MyArticles>
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
