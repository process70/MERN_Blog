import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import PostDetail from "./pages/PostDetail"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Authors from "./pages/Authors"
import CreatePost from "./pages/CreatePost"
import UserProfile from "./pages/UserProfile"
import AuthorPosts from "./pages/AuthorPosts"
import Dashboard from "./pages/Dashboard"
import CategoryPosts from "./pages/CategoryPosts"
import EditPost from "./pages/EditPost"
import DeletePost from "./pages/DeletePost"
import Logout from "./pages/Logout"
import UserContext from "./context/UserContext"

const router = createBrowserRouter([
  {
    path: '/', 
    element: <UserContext><Layout /></UserContext>, 
    errorElement: <ErrorPage />,
    /* the outlet */
    children: [
      {index: true, element: <Home />},
      {path: 'posts/:id', element: <PostDetail />},
      {path: 'register', element: <Register />},
      {path: 'login', element: <Login />},
      {path: 'authors', element: <Authors />},
      {path: 'create', element: <CreatePost />},
      {path: 'profile/:id', element: <UserProfile />},
      {path: 'posts/authors/:authorId', element: <AuthorPosts />},
      {path: 'myposts/:id', element: <Dashboard />},
      {path: 'posts/categories/:category', element: <CategoryPosts />},
      {path: 'posts/:id/edit', element: <EditPost />},
      {path: 'posts/:id/delete', element: <DeletePost />},
      {path: 'logout', element: <Logout />},
      // {path: '*', element: <ErrorPage />},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);
