import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PublicRoot from '../root/PublicRoot';
import AdminRoot from '../root/AdminRoot';
import Home from '../pages/home/Home';

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
                }
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