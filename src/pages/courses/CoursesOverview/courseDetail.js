import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Col, Row } from "reactstrap"

const CourseDetail = ({ Course }) => {
  console.log("Course Detail:", Course) // Debug: Check Course details
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={Course.avatar} alt="" className="avatar-sm me-4" />
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">
              {Course.firstName + " " + Course.lastName}
            </h5>
            <p className="text-muted">{Course.email}</p>
          </div>
        </div>
        <h5 className="font-size-15 mt-4">
          Course Specialization: {Course.specialization}
        </h5>
        <Row className="task-dates">
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-phone-call me-1 text-primary" /> Phone
              </h5>
              <p className="text-muted mb-0">{Course.phoneNumber}</p>
            </div>
          </Col>
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" /> Joined At
              </h5>
              <p className="text-muted mb-0">
                {new Date(Course.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

CourseDetail.propTypes = {
  Course: PropTypes.object.isRequired,
}

export default CourseDetail
