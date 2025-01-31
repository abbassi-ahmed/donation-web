import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Card,
  CardBody,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap"
import { format } from "date-fns"
import EditSportModal from "components/Modal/EditSportModal"

const SportDetail = ({ sport, fetchSportDetail }) => {
  const [activeTab, setActiveTab] = useState("1")
  const [editModal, setEditModal] = useState(false)

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <div>
      <EditSportModal
        show={editModal}
        toggle={() => setEditModal(!editModal)}
        sport={sport}
        onCloseClick={() => setEditModal(false)}
        onSaveFinished={() => {
          fetchSportDetail(sport.id)
          setEditModal(false)
        }}
      />
      <div className="position-relative" style={{ height: "300px" }}>
        <img
          src={sport.cover || "/placeholder.svg"}
          alt="Cover"
          className="w-100 h-100 object-fit-cover"
          style={{ filter: "brightness(0.7)" }}
        />
        <div className="position-absolute bottom-0 start-0 p-4 d-flex align-items-end">
          <img
            src={sport.logo || "/placeholder.svg"}
            alt="Sport Logo"
            className="rounded-circle border border-4 border-white shadow"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <div className="ms-3 text-white">
            <h1 className="display-6 fw-bold">{sport.name}</h1>
            <p className="small opacity-75">
              Created on {format(new Date(sport.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 fw-bold text-primary">Sport Details</h2>
          <Button color="primary" onClick={() => setEditModal(true)}>
            <i className="bi bi-pencil me-2"></i>
            Edit
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardBody className="p-0">
            <Nav tabs className="bg-light">
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => {
                    toggle("1")
                  }}
                >
                  About
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => {
                    toggle("2")
                  }}
                >
                  Gallery
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="p-4">
              <TabPane tabId="1">
                <p className="text-muted">{sport.description}</p>
                <div className="mt-3 d-flex align-items-center text-muted small">
                  <i className="bi bi-calendar me-2"></i>
                  <span>
                    Last updated on{" "}
                    {format(new Date(sport.updatedAt), "MMMM d, yyyy")}
                  </span>
                </div>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  {sport.images.map((image, index) => (
                    <Col key={index} xs={6} md={3} className="mb-3">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Sport Image ${index + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{
                          objectFit: "cover",
                          height: "150px",
                          width: "100%",
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

SportDetail.propTypes = {
  sport: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}

export default SportDetail
