import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, CardTitle, Table } from "reactstrap"
import { Link } from "react-router-dom"

const Feedback = ({ feedback }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Feedbacks</CardTitle>
        <div>
          <Table className="table align-middle">
            <tbody>
              {feedback.length > 0 ? (
                feedback.map((item, key) => (
                  <tr key={key}>
                    <td style={{ width: "50px" }}>
                      {item.user !== null ? (
                        <img
                          src={item.user.avatar}
                          className="rounded-circle avatar-xs"
                          alt=""
                        />
                      ) : (
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                            <img
                              src="https://ui-avatars.com/api/?name=Anonymous"
                              className="rounded-circle avatar-xs"
                              alt=""
                            />
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <h5 className="font-size-14 m-0">
                        <Link to="#" className="text-dark">
                          {item.user !== null
                            ? item.user.firstName + " " + item.user.lastName
                            : "Anonymous"}
                        </Link>
                      </h5>
                      <div
                        className="text-muted font-size-12 mb-0"
                        style={{ maxWidth: "300px" }}
                      >
                        <p className="text-muted font-size-12 mb-0">
                          {item.content}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">
                    <p className="text-center">No feedback for this coach</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

Feedback.propTypes = {
  feedback: PropTypes.array,
}

export default Feedback
