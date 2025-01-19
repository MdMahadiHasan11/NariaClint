import {
    createBrowserRouter,
  } from "react-router-dom";
  import Root from "./Root";
  import ErrorPageShow from "../Pages/ErrorPageShow/ErrorPageShow";
  import Home from "../Pages/Home/Home";
  import Admin from '../Pages/Admin/Admin'
// import TourPackageDetails from "../Pages/Home/TourPackageDetails";

  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,  // Main layout component
      errorElement: <ErrorPageShow />,  // Fallback for errors
      children: [
        {
          path: "/",
          element: <Home />,  // Home page component
        },
        {
          path: "/admin",
          element: <Admin></Admin> ,  // Home page component
        },
      ],
    },
  ]);
  
  export default Router;
  