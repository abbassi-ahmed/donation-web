import React from "react"
import { Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

import BlogGrid from "./BlogGrid"
import RightBar from "../BlogList/RightBar"

const Index = props => {
  //meta title
  document.title = "Blog List"
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blog" breadcrumbItem="Blog List" />
          <Row className="justify-content-center">
            <BlogGrid />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Index
