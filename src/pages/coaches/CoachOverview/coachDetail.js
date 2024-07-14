import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Col, Row } from "reactstrap"

const CoachDetail = ({ coach }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={coach.avatar} alt="" className="avatar-sm me-4" />
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">
              {coach.firstName + " " + coach.lastName}
            </h5>
            <p className="text-muted">{coach.email}</p>
          </div>
        </div>
        <h5 className="font-size-15 mt-4">
          Coach Specialization: {coach.specialization}
        </h5>
        <Row className="task-dates">
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-phone-call me-1 text-primary" /> Phone
              </h5>
              <p className="text-muted mb-0">{coach.phoneNumber}</p>
            </div>
          </Col>
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" /> Joined At
              </h5>
              <p className="text-muted mb-0">
                {new Date(coach.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

CoachDetail.propTypes = {
  coach: PropTypes.object.isRequired,
}

export default CoachDetail
