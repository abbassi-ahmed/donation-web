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
import Coaches from "pages/coaches/coaches"
import CoachCreate from "pages/coaches/coach-create"
import Index from "pages/FileManager"
//blog
import BlogList from "pages/Blog/BlogList/index"
import BlogGrid from "../pages/Blog/BlogGrid/index"
import BlogDetails from "../pages/Blog/BlogDetails"

import PagesFaqs from "../pages/Utility/pages-faqs"
import CoachesOverview from "pages/coaches/CoachOverview/coach-overview"
import ManageCoaches from "pages/manage-coach/manage-coach"
import Courses from "pages/courses/courses"
import CourseCreate from "pages/courses/course-create"
import CourseesOverview from "pages/courses/CoursesOverview/course-overview"
import Products from "pages/products/products"
import ProductCreate from "pages/products/product-create"
import OfferCreate from "pages/offers/offer-create"
import AbonnementCreate from "pages/abonnement/abonnement-create"
import Feedback from "pages/feebacks/feedback"
import ProductOverview from "pages/products/product-overview"
import ProductPayments from "pages/payments/productPayments"
import OfferPayments from "pages/payments/offerPayments"
import AbonnementPayments from "pages/payments/abonnementPayments"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  // //profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/manage-admins", component: <ManageAdmins /> },
  { path: "/manage-coach", component: <ManageCoaches /> },
  { path: "/manage-users", component: <ManageUsers /> },
  { path: "/projects", component: <Projects /> },
  { path: "/projects-create", component: <ProjectsCreate /> },
  { path: "/projects-overview", component: <ProjectsOverview /> },
  { path: "/projects-overview/:id", component: <ProjectsOverview /> },
  { path: "/coaches", component: <Coaches /> },

  { path: "/coaches-create", component: <CoachCreate /> },
  { path: "/coaches-overview", component: <CoachesOverview /> },
  { path: "/coach-overview/:id", component: <CoachesOverview /> },
  { path: "/products", component: <Products /> },
  { path: "/products-create", component: <ProductCreate /> },
  { path: "/product-overview/:id", component: <ProductOverview /> },
  { path: "/offers", component: <OfferCreate /> },
  { path: "/abonnement", component: <AbonnementCreate /> },
  { path: "/feedback", component: <Feedback /> },
  { path: "/product-payments", component: <ProductPayments /> },
  { path: "/offer-payments", component: <OfferPayments /> },
  { path: "/abonnement-payments", component: <AbonnementPayments /> },

  { path: "/courses", component: <Courses /> },
  { path: "/courses-create", component: <CourseCreate /> },
  { path: "/courses-overview", component: <CourseesOverview /> },
  { path: "/courses-overview/:id", component: <CourseesOverview /> },

  { path: "/apps-filemanager", component: <Index /> },
  // { path: "/blog", component: <Blog /> },
  { path: "/blog-list", component: <BlogList /> },
  { path: "/blog-grid", component: <BlogGrid /> },
  { path: "/blog-details/:id", component: <BlogDetails /> },
  //Utility
  { path: "/pages-faqs", component: <PagesFaqs /> },

  { path: "/calendar", component: <Calendar /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
]

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }
