import React from "react"
import { Row, Col, Container } from "reactstrap"

import { Link } from "react-router-dom"

import logoImg from "../../assets/images/logo.svg"

const NoPermission = props => {
  //meta title
  document.title = "No Permission"
  return (
    <React.Fragment>
      <Container fluid className="p-0">
        <Row className="flex-center  justify-content-center align-items-center">
          <Col lg={12}>
            <div className="auth-page-content p-4 d-flex h-100">
              <div className="w-100">
                <div className="text-center">
                  <Link to="/" className="logo">
                    <img src={logoImg} height="24" alt="logo" />
                  </Link>
                  <h4 className="font-size-18 mt-5">No Permission</h4>
                  <p className="text-muted">
                    You don't have permission to access this page
                  </p>
                  <Link className="btn btn-primary" to="/">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default NoPermission
