import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"

const CardCourses = ({ courses }) => {
  return (
    <React.Fragment>
      {(courses || []).map((course, key) => (
        <Col xl={4} sm={6} key={key}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="avatar-md me-4">
                  <span
                    className="avatar-title rounded-circle bg-light text-danger font-size-16 d-flex align-items-center justify-content-center"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <img
                      src={course.avatar}
                      alt=""
                      className="rounded-circle w-100 h-100"
                    />
                  </span>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="text-truncate font-size-15">
                    <Link
                      to={`/course-overview/${course.id}`}
                      className="text-dark"
                    >
                      {course.firstName + " " + course.lastName}
                    </Link>
                  </h5>
                  <p className="text-muted mb-4">{course.specialization}</p>
                  <div className="avatar-group">
                    {/* {(course.donators || []).map((donator, key) =>
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
                    )} */}
                  </div>
                </div>
              </div>
            </CardBody>
            <div className="px-4 py-3 border-top">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-3">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-envelope me-1 font-size-18" />
                    <Badge id="emailTooltip" className={"bg-" + course.color}>
                      {course.email}
                    </Badge>
                    <UncontrolledTooltip placement="top" target="emailTooltip">
                      Email Address
                    </UncontrolledTooltip>
                  </div>
                </li>

                <li className="list-inline-item me-3" id="dueDate">
                  <i className="bx bx-phone-call me-1 font-size-18" />{" "}
                  {course.phoneNumber}
                  <UncontrolledTooltip placement="top" target="dueDate">
                    Phone Number
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

CardCourses.propTypes = {
  course: PropTypes.array,
}

CardCourses.defaultProps = {
  courses: [],
}

export default CardCourses
