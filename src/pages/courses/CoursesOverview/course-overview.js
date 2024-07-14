import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import CourseDetail from "./courseDetail"
import TeamMembers from "./teamMembers"
import OverviewChart from "./overviewChart"
import AttachedFiles from "./attachedFiles"
import Comments from "./comments"

const CourseesOverview = () => {
  // Meta title
  document.title = "Course Overview | Skote - React Admin & Dashboard Template"

  const { id } = useParams()
  const [CourseDetail, setCourseDetail] = useState({})
  const [error, setError] = useState(null)

  const fetchCourseDetail = async CourseId => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DATABASEURL}/Course/find-one/${CourseId}`
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setCourseDetail(data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id)
    }
  }, [id])

  const options = {}
  const series = []

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Coursees" breadcrumbItem="Coursees Overview" />
          {!isEmpty(CourseDetail) && (
            <>
              <Row>
                <Col lg="8">
                  <CourseDetail Course={CourseDetail} />
                </Col>

                {/* <Col lg="4">
                  <TeamMembers team={CourseDetail.team} />
                </Col> */}
              </Row>

              <Row>
                {/* <Col lg="4">
                  <OverviewChart options={options} series={series} />
                </Col> */}

                {/* <Col lg="4">
                  <AttachedFiles files={CourseDetail.files} />
                </Col> */}

                {/* <Col lg="4">
                  <Comments comments={CourseDetail.comments} />
                </Col> */}
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

CourseesOverview.propTypes = {
  match: PropTypes.object,
}

export default CourseesOverview
