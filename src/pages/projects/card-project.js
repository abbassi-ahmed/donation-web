import PropTypes from "prop-types"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"
import axios from "axios"
import { toast } from "react-toastify"
import DeleteModal from "components/Common/DeleteModal"

const CardProject = ({ projects, fetchProjects }) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [projectId, setProjectId] = useState(null)

  const handleDelete = async projectId => {
    try {
      await axios
        .delete(
          `${process.env.REACT_APP_DATABASEURL}/projects/remove/${projectId}`
        )
        .then(response => {
          fetchProjects()
          setDeleteModal(false)

          toast.success("Project deleted successfully")
        })
    } catch (error) {
      console.error("Error deleting blog", error)
    }
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDelete(projectId)}
        onCloseClick={() => setDeleteModal(false)}
      />
      {(projects || []).map(project => (
        <Col xl={4} sm={6} key={project.id} className="mb-4">
          <Card style={{ height: "100%", borderRadius: "10px" }}>
            <CardBody>
              <div className="d-flex">
                <div className="avatar-md me-4">
                  <span className="rounded-circle text-danger font-size-16">
                    <img
                      src={project.image}
                      alt=""
                      height="60"
                      width={"60px"}
                      style={{ borderRadius: "50%" }}
                    />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="text-truncate font-size-15">
                        <Link
                          to={`/projects-overview/${project.id}`}
                          className="text-dark"
                        >
                          {project.name}
                        </Link>
                      </h5>
                      <p className="text-muted mb-4">{project.description}</p>
                    </div>
                    <div>
                      <div
                        className="btn btn-primary"
                        onClick={() => {
                          setProjectId(project.id)
                          setDeleteModal(true)
                        }}
                      >
                        <i className="mdi mdi-trash-can me-1 align-middle"></i>
                      </div>
                    </div>
                  </div>
                  <div className="avatar-group">
                    {(project.donators || []).map((donator, key) =>
                      !donator.img || donator.img !== "Null" ? (
                        <React.Fragment key={key}>
                          <div className="avatar-group-item">
                            <Link
                              to="#"
                              className="d-inline-block"
                              id={"member" + donator.id}
                            >
                              <img
                                src={donator.img}
                                className="rounded-circle avatar-xs"
                                alt=""
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target={"member" + donator.id}
                              >
                                {donator.fullname}
                              </UncontrolledTooltip>
                            </Link>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={key}>
                          <div className="avatar-group-item">
                            <Link
                              to="#"
                              className="d-inline-block"
                              id={"member" + donator.id}
                            >
                              <div className="avatar-xs">
                                <span
                                  className={`avatar-title rounded-circle bg-${donator.color} text-white font-size-16`}
                                >
                                  {donator.name}
                                </span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"member" + donator.id}
                                >
                                  {donator.fullname}
                                </UncontrolledTooltip>
                              </div>
                            </Link>
                          </div>
                        </React.Fragment>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
            <div className="px-4 py-3 border-top">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-3">
                  <Badge className={"bg-" + project.color}>
                    {project.Status}
                  </Badge>
                </li>
                <li className="list-inline-item me-3" id="dueDate">
                  <i className="bx bx-calendar me-1" /> {project.targetDate}
                  <UncontrolledTooltip placement="top" target="dueDate">
                    Target Date
                  </UncontrolledTooltip>
                </li>
                <li
                  className="list-inline-item me-3 align-self-center"
                  id="comments"
                >
                  <i className="bx bx-dollar me-1" />
                  {project.target || 0}
                  <UncontrolledTooltip placement="top" target="comments">
                    Target Amount
                  </UncontrolledTooltip>
                </li>
                <li className="list-inline-item me-3" id="types">
                  <i className="bx bx- bxs-category me-1" />
                  {project.type}
                  <UncontrolledTooltip placement="top" target="types">
                    Project Type
                  </UncontrolledTooltip>
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  )
}

CardProject.propTypes = {
  projects: PropTypes.array,
}

CardProject.defaultProps = {
  projects: [],
}

export default CardProject
