import React, { useEffect, useState } from "react"

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap"
import axios from "axios"
import classnames from "classnames"
import DeleteModal from "components/Common/DeleteModal"
import NoData from "../../assets/svg/no-data.svg"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const PagesFaqs = () => {
  document.title = "FAQs"
  const [deleteModal, setDeleteModal] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState(null)
  const [activeTab, setactiveTab] = useState("1")
  const [FaqGeneral, setFaqGeneral] = useState([])
  const fetchData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DATABASEURL}/faq/find-by-type`,
        {
          type:
            activeTab === "1"
              ? "General"
              : activeTab === "2"
              ? "Privacy"
              : "Support",
        }
      )

      setFaqGeneral(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const onClickDelete = async id => {
    try {
      setDeleteModal(true)
      setFaqToDelete(id)
    } catch (error) {
      console.error(error)
    }
  }
  const handleDeleteFaq = async () => {
    try {
      setDeleteModal(false)
      await axios.delete(
        process.env.REACT_APP_DATABASEURL + "/faq/remove/" + faqToDelete
      )
      fetchData()
      toast.success("FAQ deleted successfully")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Utility" breadcrumbItem="FAQs" />

          <div className="checkout-tabs">
            <Row>
              <Col lg="2">
                <Nav className="flex-column" pills>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "1" })}
                      onClick={() => {
                        setactiveTab("1")
                      }}
                    >
                      <i className="bx bx-question-mark d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">General Questions</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "2" })}
                      onClick={() => {
                        setactiveTab("2")
                      }}
                    >
                      <i className="bx bx-check-shield d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">Privacy Policy</p>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === "3" })}
                      onClick={() => {
                        setactiveTab("3")
                      }}
                    >
                      <i className="bx bx-support d-block check-nav-icon mt-4 mb-2" />
                      <p className="font-weight-bold mb-4">Support</p>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col lg="10">
                <Card>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <CardTitle className="mb-5">
                          General Questions
                        </CardTitle>
                        {FaqGeneral.length > 0 ? (
                          FaqGeneral.map(item => (
                            <div key={item.id} className="faq-box d-flex mb-4">
                              <div className="flex-shrink-0 me-3 faq-icon">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="font-size-15">
                                  {item.question}
                                </h5>
                                <p className="text-muted">{item.answer}</p>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="flex-shrink-0 ms-3"
                                onClick={() => onClickDelete(item.id)}
                              >
                                <i className="bx bx-trash font-size-20 text-danger" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">
                            <img src={NoData} alt="No data" height="200" />
                            <p className="text-muted mt-4">
                              No FAQs available.
                            </p>
                          </div>
                        )}
                      </TabPane>
                      <TabPane tabId="2">
                        <CardTitle className="mb-5">
                          Privacy Questions
                        </CardTitle>
                        {FaqGeneral.length > 0 ? (
                          FaqGeneral.map(item => (
                            <div key={item.id} className="faq-box d-flex mb-4">
                              <div className="flex-shrink-0 me-3 faq-icon">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="font-size-15">
                                  {item.question}
                                </h5>
                                <p className="text-muted">{item.answer}</p>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="flex-shrink-0 ms-3"
                                onClick={() => onClickDelete(item.id)}
                              >
                                <i className="bx bx-trash font-size-20 text-danger" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">
                            <img src={NoData} alt="No data" height="200" />
                            <p className="text-muted mt-4">
                              No FAQs available.
                            </p>
                          </div>
                        )}
                      </TabPane>
                      <TabPane tabId="3">
                        <CardTitle className="mb-5">Support</CardTitle>
                        {FaqGeneral.length > 0 ? (
                          FaqGeneral.map(item => (
                            <div key={item.id} className="faq-box d-flex mb-4">
                              <div className="flex-shrink-0 me-3 faq-icon">
                                <i className="bx bx-help-circle font-size-20 text-success" />
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="font-size-15">
                                  {item.question}
                                </h5>
                                <p className="text-muted">{item.answer}</p>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                className="flex-shrink-0 ms-3"
                                onClick={() => onClickDelete(item.id)}
                              >
                                <i className="bx bx-trash font-size-20 text-danger" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">
                            <img src={NoData} alt="No data" height="200" />
                            <p className="text-muted mt-4">
                              No FAQs available.
                            </p>
                          </div>
                        )}
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteFaq}
        onCloseClick={() => setDeleteModal(false)}
      />
    </React.Fragment>
  )
}

export default PagesFaqs
