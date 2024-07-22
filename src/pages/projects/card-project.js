import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"

const CardProject = ({ projects }) => {
  return (
    <React.Fragment>
      {(projects || []).map((project, key) => (
        <Col xl={4} sm={6} key={key}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="avatar-md me-4">
                  <span className="avatar-title rounded-circle bg-light text-danger font-size-16">
                    <img src={project.image} alt="" height="30" />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="text-truncate font-size-15">
                    <Link
                      to={`/projects-overview/${project.id}`}
                      className="text-dark"
                    >
                      {project.name}
                    </Link>
                  </h5>
                  <p className="text-muted mb-4">{project.description}</p>
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
