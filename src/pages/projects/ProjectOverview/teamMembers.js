import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, CardTitle, Table } from "reactstrap"
import { Link } from "react-router-dom"

const Donators = ({ team, sum }) => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Donators </CardTitle>
        <div className="table-responsive">
          <Table className="table align-middle table-nowrap">
            <tbody>
              {(team || []).map((item, key) => (
                <tr key={key}>
                  <td style={{ width: "50px" }}>
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        className="rounded-circle avatar-xs"
                        alt=""
                      />
                    ) : (
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                          {item.user.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <h5 className="font-size-14 m-0">
                      <Link to="#" className="text-dark">
                        {item.user.firstName} {item.user.lastName}
                      </Link>
                    </h5>
                  </td>
                  <td>
                    <div>
                      <Link
                        to="#"
                        className="badge bg-primary-subtle text-primary font-size-11 me-1"
                      >
                        ${item.amount}
                      </Link>
                      <Link
                        to="#"
                        className="badge bg-primary-subtle text-primary font-size-11"
                      >
                        {new Date(item.createdAt)
                          .toLocaleDateString()
                          .replace(/\//g, "-")}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-muted"> Total Donations: ${sum ? sum : 0}</p>
        </div>
      </CardBody>
    </Card>
  )
}

Donators.propTypes = {
  team: PropTypes.array,
}

export default Donators
