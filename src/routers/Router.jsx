import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PublicRoot from '../root/PublicRoot';
import AdminRoot from '../root/AdminRoot';
import Home from '../pages/home/Home';
import LoginPage from '../pages/login/LoginPage';
import RegistrationPage from '../pages/registration/RegistrationPage';

const Router = () => {
    const router = createBrowserRouter([
		{
			path: "/",
			element: <PublicRoot></PublicRoot>,
            errorElement:<p>THis is error page</p>,
            children:[
                {
                    path:"",
                    element:<Home></Home>
                },
                {
                    path:"login",
                    element:<LoginPage></LoginPage>
                },
                {
                    path:"register",
                    element:<RegistrationPage></RegistrationPage>
                },
            ]
		},
        {
            path:"/admin/",
            element:<AdminRoot></AdminRoot>,
            errorElement:<p>You are not authorized</p>,
            children:[
                {
                    path: "dashboard",
                    element:<p>This is dashboard</p>
                }
            ]
        }
	]);
    return <RouterProvider router={router} />;
};

export default Router;