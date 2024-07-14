import { Link } from "react-router-dom"
import React, { useState, useEffect } from "react"
import {
  Badge,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip,
} from "reactstrap"
import axios from "axios"

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([])

  const getFeedbacks = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/feedback/find-all"
      )
      setFeedbacks(response.data)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    }
  }

  useEffect(() => {
    getFeedbacks()
  }, [])

  return (
    <div className="page-content">
      <Row>
        {feedbacks.map((feedback, key) => (
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
                        src={feedback.coach.avatar}
                        alt=""
                        className="rounded-circle w-100 h-100"
                      />
                    </span>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="text-truncate font-size-15 text-dark">
                      {feedback.coach.firstName + " " + feedback.coach.lastName}
                    </h5>
                    <p className="text-muted mb-2">The feedback is:</p>
                    <p className="text-muted mb-4">{feedback.content}</p>
                    <div className="avatar-group"></div>
                  </div>
                </div>
              </CardBody>
              <div className="px-4 py-3 border-top">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item me-3">
                    <div className="d-flex align-items-center">
                      <i className="bx bx-envelope me-1 font-size-18" />
                      <Badge
                        id={`emailTooltip-${key}`}
                        className={`bg-${feedback.color}`}
                      >
                        {feedback.user
                          ? feedback.user.email
                          : "Annonymos feedBack"}
                      </Badge>
                      <UncontrolledTooltip
                        placement="top"
                        target={`emailTooltip-${key}`}
                      >
                        Email Address of the user
                      </UncontrolledTooltip>
                    </div>
                  </li>
                  {feedback.user ? (
                    <li
                      className="list-inline-item me-3"
                      id={`phoneTooltip-${key}`}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bx bx-phone-call me-1 font-size-18" />

                        {feedback.user.phoneNumber}
                        <UncontrolledTooltip
                          placement="top"
                          target={`phoneTooltip-${key}`}
                        >
                          Phone Number of the user
                        </UncontrolledTooltip>
                      </div>
                    </li>
                  ) : null}

                  <li
                    className="list-inline-item me-3"
                    id={`dateTooltip-${key}`}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bx bx-calendar me-1 font-size-18" />

                      {new Date(feedback.createdAt).toLocaleDateString()}
                      <UncontrolledTooltip
                        placement="top"
                        target={`dateTooltip-${key}`}
                      >
                        Sent At
                      </UncontrolledTooltip>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
