import PropTypes from "prop-types"
import React from "react"
import { useSelector } from "react-redux"
import { createSelector } from "reselect"
import { Routes, Route } from "react-router-dom"
import { layoutTypes } from "./constants/layout"

import { authProtectedRoutes, publicRoutes } from "./routes"

import Authmiddleware from "./routes/route"

import VerticalLayout from "./components/VerticalLayout/"
import HorizontalLayout from "./components/HorizontalLayout/"
import NonAuthLayout from "./components/NonAuthLayout"

import "./assets/scss/theme.scss"
import PermissionRoute from "helpers/permissionRoute"

const getLayout = layoutType => {
  let Layout = VerticalLayout
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout
      break
    case layoutTypes.HORIZONTAL:
      Layout = HorizontalLayout
      break
    default:
      break
  }
  return Layout
}

const App = () => {
  const selectLayoutState = state => state.Layout
  const LayoutProperties = createSelector(selectLayoutState, layout => ({
    layoutType: layout.layoutType,
  }))

  const { layoutType } = useSelector(LayoutProperties)

  const Layout = getLayout(layoutType)

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>
                  <PermissionRoute
                    element={route.component}
                    requiredPermission={route.permission}
                  />
                </Layout>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
