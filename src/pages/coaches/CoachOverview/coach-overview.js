import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import CoachDetail from "./coachDetail"
import Feedback from "./feedback"
import OverviewChart from "./overviewChart"
import AttachedFiles from "./attachedFiles"
import Comments from "./comments"
import axios from "axios"

const CoachesOverview = () => {
  // Meta title
  document.title = "Coach Overview | Skote - React Admin & Dashboard Template"

  const { id } = useParams()
  const [coachDetail, setCoachDetail] = useState({})
  const [feedback, setFeedback] = useState([])
  const [error, setError] = useState(null)

  const fetchCoachDetail = async coachId => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/coach/find-one/${coachId}`
      )
      setCoachDetail(response.data)
    } catch (error) {
      setError(error.message)
    }
  }
  const fetchFeedback = async coachId => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/feedback/find-by-coach/${coachId}`
      )
      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`)
      }
      setFeedback(response.data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCoachDetail(id)
      fetchFeedback(id)
    }
  }, [id])

  const options = {}
  const series = []

  if (error) {
    console.error(error)
    return <div>Error: {error}</div>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Coaches" breadcrumbItem="Coaches Overview" />
          {!isEmpty(coachDetail) && (
            <>
              <Row>
                <Col lg="8">
                  <CoachDetail coach={coachDetail} />
                </Col>

                <Col lg="4">
                  <Feedback feedback={feedback} />
                </Col>
              </Row>

              <Row>
                {/* <Col lg="4">
                  <OverviewChart options={options} series={series} />
                </Col> */}

                {/* <Col lg="4">
                  <AttachedFiles files={coachDetail.files} />
                </Col> */}

                {/* <Col lg="4">
                  <Comments comments={coachDetail.comments} />
                </Col> */}
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

CoachesOverview.propTypes = {
  match: PropTypes.object,
}

export default CoachesOverview
