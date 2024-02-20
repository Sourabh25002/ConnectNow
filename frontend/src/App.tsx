import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ProfileForm from "./components/UpdateProfile";
import CreatePost from "./components/CreatePost";
import Post from "./components/Posts";
import UpdatePost from "./components/UpdatePost";

const router = createBrowserRouter([
  {
    path: "/login",
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
  {
    path: "/createPost",
    element: <CreatePost />,
  },
  {
    path: "/posts",
    element: <Post />,
  },
  {
    path: "/updatePost/:post_id",
    element: <UpdatePost />,
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
