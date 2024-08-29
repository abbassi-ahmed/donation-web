import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

import Calendar from "../pages/Calendar/index"
// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
// import Blog from "pages/Dashboard-Blog/index"

import ManageAdmins from "pages/manage-admins/manage-admins"
import ManageUsers from "pages/manage-users/manage-users"
import Projects from "pages/projects/projects"
import ProjectsCreate from "pages/projects/projects-create"
import ProjectsOverview from "pages/projects/ProjectOverview/projects-overview"
import Index from "pages/FileManager"
//blog
import BlogList from "pages/Blog/BlogList/index"
import BlogGrid from "../pages/Blog/BlogGrid/index"
import BlogDetails from "../pages/Blog/BlogDetails"

import PagesFaqs from "../pages/Utility/pages-faqs"
import Feedback from "pages/feebacks/feedback"
import DonationProject from "pages/payments/projectDonation"
import Donation from "pages/payments/donation"
import CreateBlog from "pages/Blog/createBlog"
import CreateFaq from "pages/Utility/create-faqs"
import FolderDetail from "pages/FileManager/folderDetail"
import ChildFileList from "pages/FileManager/childFileList"
import ManageCategorie from "pages/manage-categorie/manage-categorie"
import FunFact from "pages/manage-fun-fact/funcFact"
import ManageWhyChoose from "pages/why-choose-section/whyChoose"
import ManageSlider from "pages/slider-section/slider-section"
import WhatSection from "pages/what-section/what-section"
import AboutSection from "pages/manage-about/about"
import ManageBrands from "pages/manage-brands/manage-brands"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  // //profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/manage-admins", component: <ManageAdmins /> },
  { path: "/manage-users", component: <ManageUsers /> },
  { path: "/projects", component: <Projects /> },
  { path: "/projects-create", component: <ProjectsCreate /> },
  { path: "/projects-overview", component: <ProjectsOverview /> },
  { path: "/projects-overview/:id", component: <ProjectsOverview /> },
  { path: "/feedback", component: <Feedback /> },
  { path: "/project-donation", component: <DonationProject /> },
  { path: "/donation", component: <Donation /> },
  { path: "/apps-filemanager", component: <Index /> },
  { path: "/folder-details/:id", component: <FolderDetail /> },
  { path: "/child-folder-detail/:id", component: <ChildFileList /> },

  // { path: "/blog", component: <Blog /> },
  { path: "/blog-list", component: <BlogList /> },
  { path: "/blog-grid", component: <BlogGrid /> },
  { path: "/blog-create", component: <CreateBlog /> },
  { path: "/blog-details/:id", component: <BlogDetails /> },
  //Utility
  { path: "/faq", component: <PagesFaqs /> },
  { path: "/faq-create", component: <CreateFaq /> },

  { path: "/calendar", component: <Calendar /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },

  // Manage Section
  { path: "/manage-slider", component: <ManageSlider /> },
  { path: "/manage-categories", component: <ManageCategorie /> },
  { path: "/manage-fun", component: <FunFact /> },
  { path: "/manage-why-choose", component: <ManageWhyChoose /> },
  { path: "/what-say", component: <WhatSection /> },
  { path: "/about-section", component: <AboutSection /> },
  { path: "/brands-section", component: <ManageBrands /> },
]

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
