import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProfileForm from "./components/UpdateProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/edit",
    element: <ProfileForm />,
  },
]);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
