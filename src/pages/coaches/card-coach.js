import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"

const CardCoaches = ({ coaches }) => {
  return (
    <React.Fragment>
      {(coaches || []).map((coach, key) => (
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
                      src={coach.avatar}
                      alt=""
                      className="rounded-circle w-100 h-100"
                    />
                  </span>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="text-truncate font-size-15">
                    <Link
                      to={`/coach-overview/${coach.id}`}
                      className="text-dark"
                    >
                      {coach.firstName + " " + coach.lastName}
                    </Link>
                  </h5>
                  <p className="text-muted mb-4">{coach.specialization}</p>
                  <div className="avatar-group">
                    {/* {(coach.donators || []).map((donator, key) =>
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
                    <Badge id="emailTooltip" className={"bg-" + coach.color}>
                      {coach.email}
                    </Badge>
                    <UncontrolledTooltip placement="top" target="emailTooltip">
                      Email Address
                    </UncontrolledTooltip>
                  </div>
                </li>
                <li className="list-inline-item me-3" id="dueDate">
                  <div className="d-flex align-items-center">
                    <i className="bx bx-phone-call me-1 font-size-18" />{" "}
                    {coach.phoneNumber}
                    <UncontrolledTooltip placement="top" target="dueDate">
                      Phone Number
                    </UncontrolledTooltip>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  )
}

CardCoaches.propTypes = {
  coach: PropTypes.array,
}

CardCoaches.defaultProps = {
  coaches: [],
}

export default CardCoaches
