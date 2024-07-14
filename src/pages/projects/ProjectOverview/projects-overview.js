import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import ProjectDetail from "./projectDetail"
import TeamMembers from "./teamMembers"
import OverviewChart from "./overviewChart"
import AttachedFiles from "./attachedFiles"
import Comments from "./comments"

const ProjectsOverview = () => {
  // Meta title
  document.title = "Project Overview | Skote - React Admin & Dashboard Template"

  const { id } = useParams()
  const [projectDetail, setProjectDetail] = useState({})
  const [error, setError] = useState(null)

  const fetchProjectDetail = async projectId => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DATABASEURL}/projects/find-one/${projectId}`
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setProjectDetail(data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProjectDetail(id)
    }
  }, [id])

  const options = {} // Placeholder for chart options
  const series = [] // Placeholder for chart series

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" />
          {!isEmpty(projectDetail) && (
            <>
              <Row>
                <Col lg="8">
                  <ProjectDetail project={projectDetail} />
                </Col>

                <Col lg="4">
                  <TeamMembers team={projectDetail.team} />
                </Col>
              </Row>

              <Row>
                <Col lg="4">
                  <OverviewChart options={options} series={series} />
                </Col>

                <Col lg="4">
                  <AttachedFiles files={projectDetail.files} />
                </Col>

                <Col lg="4">
                  <Comments comments={projectDetail.comments} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

ProjectsOverview.propTypes = {
  match: PropTypes.object,
}

export default ProjectsOverview
