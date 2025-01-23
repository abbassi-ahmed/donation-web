import React from "react"
import { Navigate } from "react-router-dom"

import UserProfile from "../pages/Authentication/user-profile"

import Calendar from "../pages/Calendar/index"

import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

import ManageAdmins from "pages/manage-admins/manage-admins"
import ManageUsers from "pages/manage-users/manage-users"
import Projects from "pages/projects/projects"
import ProjectsCreate from "pages/projects/projects-create"
import ProjectsOverview from "pages/projects/ProjectOverview/projects-overview"
import Index from "pages/FileManager"
import BlogList from "pages/Blog/BlogList/index"
import BlogGrid from "../pages/Blog/BlogGrid/index"
import BlogDetails from "../pages/Blog/BlogDetails"

import PagesFaqs from "../pages/Utility/pages-faqs"
import DonationProject from "pages/payments/projectDonation"
import Donation from "pages/payments/donation"
import CreateBlog from "pages/Blog/createBlog"
import CreateFaq from "pages/Utility/create-faqs"
import FolderDetail from "pages/FileManager/folderDetail"
import ChildFileList from "pages/FileManager/childFileList"
import ManageCategorie from "pages/manage-categorie/manage-categorie"
import FunFact from "pages/manage-fun-fact/funcFact"
import ManageSlider from "pages/slider-section/slider-section"
import AboutSection from "pages/manage-about/about"
import CreateSubscription from "pages/subscription/subscriptionCreate"
import SubscriptionList from "pages/subscription/SubscriptionList"
import SubscriptionPayments from "pages/payments/subscription"
import DerigantsCreate from "pages/derigant/derigant-create"
import Derigants from "pages/derigant/derigants"
import Contact from "pages/contact"
import Gallery from "pages/gallery/gallery"
import ManagePartners from "pages/manage-brands/manage-brands"
import ManageTogether from "pages/manage-together/manage-together"
import NoPermission from "pages/Authentication/noPermission"

const authProtectedRoutes = [
  { path: "/profile", component: <UserProfile />, permission: "all" },
  {
    path: "/manage-admins",
    component: <ManageAdmins />,
    permission: "manage users",
  },
  {
    path: "/manage-users",
    component: <ManageUsers />,
    permission: "manage users",
  },
  { path: "/projects", component: <Projects />, permission: "projects" },
  {
    path: "/projects-create",
    component: <ProjectsCreate />,
    permission: "projects",
  },
  {
    path: "/projects-overview",
    component: <ProjectsOverview />,
    permission: "projects",
  },
  {
    path: "/projects-overview/:id",
    component: <ProjectsOverview />,
    permission: "projects",
  },
  {
    path: "/project-donation",
    component: <DonationProject />,
    permission: "donations",
  },
  {
    path: "/subscription-donation",
    component: <DonationProject />,
    permission: "donations",
  },
  { path: "/donation", component: <Donation />, permission: "donations" },
  {
    path: "/apps-filemanager",
    component: <Index />,
    permission: "file manager",
  },
  {
    path: "/folder-details/:id",
    component: <FolderDetail />,
    permission: "file manager",
  },
  {
    path: "/child-folder-detail/:id",
    component: <ChildFileList />,
    permission: "file manager",
  },

  { path: "/blog-list", component: <BlogList />, permission: "blog" },
  { path: "/blog-grid", component: <BlogGrid />, permission: "blog" },
  { path: "/blog-create", component: <CreateBlog />, permission: "blog" },
  {
    path: "/blog-details/:id",
    component: <BlogDetails />,
    permission: "blog",
  },
  { path: "/faq", component: <PagesFaqs />, permission: "faq" },
  { path: "/faq-create", component: <CreateFaq />, permission: "faq" },
  {
    path: "/subscription-create",
    component: <CreateSubscription />,
    permission: "subscription",
  },
  {
    path: "/subscriptions",
    component: <SubscriptionList />,
    permission: "subscription",
  },
  {
    path: "/subscriptions-payments",
    component: <SubscriptionPayments />,
    permission: "donations",
  },

  { path: "/derigants", component: <Derigants />, permission: "derigants" },
  {
    path: "/derigants-create",
    component: <DerigantsCreate />,
    permission: "derigants",
  },

  { path: "/action", component: <Calendar />, permission: "action" },
  { path: "/contact", component: <Contact />, permission: "contact" },

  { path: "/gallery", component: <Gallery />, permission: "manage pages" },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/profile" />,
    permission: "all",
  },

  {
    path: "/manage-slider",
    component: <ManageSlider />,
    permission: "manage pages",
  },
  {
    path: "/manage-categories",
    component: <ManageCategorie />,
    permission: "manage pages",
  },
  { path: "/manage-fun", component: <FunFact />, permission: "manage pages" },

  {
    path: "/about-section",
    component: <AboutSection />,
    permission: "manage pages",
  },
  {
    path: "/partner-section",
    component: <ManagePartners />,
    permission: "manage pages",
  },
  {
    path: "/info-section",
    component: <ManageTogether />,
    permission: "manage pages",
  },
]

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/no-permission", component: <NoPermission /> },
  { path: "*", component: <Navigate to="/profile" /> },
]

export { authProtectedRoutes, publicRoutes }
