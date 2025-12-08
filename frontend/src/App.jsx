// App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/Profile";
import Jobs from "./components/Jobs";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-25"> {/* padding so content not hidden behind fixed navbar */}
        <Outlet />
      </div>
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        path: "/", 
        element: <Home />
       },
      { 
        path: "/login",
        element: <Login/>
      },
      { 
        path: "/signup",
        element: <Signup/> 
      },
      {
        path:"/jobs",
        element:<Jobs/>
      },
      {
        path:"/description/:id",
        element:<JobDescription/>
      },
      { 
        path: "/profile", 
        element: <Profile/> 
      },

      //admin

      {
        path:"/admin/companies",
        element:<Companies/>
      },
      {
        path:"/admin/companies/create",
        element:<CompanyCreate/>
      },
       {
        path:"/admin/companies/:id",
        element:<CompanySetup/>
      },
       {
        path:"/admin/companies/:id",
        element:<CompanySetup/>
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;

