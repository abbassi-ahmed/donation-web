import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Col, Row } from "reactstrap"
import ProgressBar from "react-bootstrap/ProgressBar"

const ProjectDetail = ({ project, sum }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={project.image} alt="" className="avatar-sm me-4" />
          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">
              {project.name || "Project Name"}
            </h5>
            <p className="text-muted">
              {project.description || "Project description goes here."}
            </p>
          </div>
        </div>
        <h5 className="font-size-15 mt-4">Project Details :</h5>
        <p className="text-muted">
          {project.description || "No detailed description available."}
        </p>
        <h5 className="font-size-15 mt-4">Project Progress :</h5>
        <ProgressBar
          now={project.target ? (sum / project.target) * 100 : 0}
          animated
          style={{ height: "20px" }}
          color="primary"
          label={`${
            project.target ? ((sum / project.target) * 100).toFixed(2) : "0.00"
          }%`}
        />
        <Row className="task-dates">
          <Col sm="3" xs="4">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" /> Start Date
              </h5>
              <p className="text-muted mb-0">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
          </Col>
          <Col sm="3" xs="4">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar-check me-1 text-primary" /> Target
                Date
              </h5>
              <p className="text-muted mb-0">
                {new Date(project.targetDate).toLocaleDateString()}
              </p>
            </div>
          </Col>

          <Col sm="3" xs="4">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-dollar-circle me-1 text-primary" /> Target
                Ammount
              </h5>
              <p className="text-muted mb-0">{project.target}</p>
            </div>
          </Col>
          <Col sm="3" xs="4">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx- bxs-category me-1 text-primary" />
                Project Type
              </h5>
              <p className="text-muted mb-0">{project.type}</p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

ProjectDetail.propTypes = {
  project: PropTypes.object.isRequired,
}

export default ProjectDetail
