import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import Cards
import CardProject from "./card-project"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Projects = () => {
  // Meta title
  document.title = "Projects Grid | Skote - React Admin & Dashboard Template"

  const [projects, setProjects] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_DATABASEURL + "/projects/find-all"
        )
        setProjects(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = projects.slice(indexOfFirst, indexOfLast)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Projects" />

          <Row>
            {/* Import Cards */}
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {projects.length > 0 ? (
                  <>
                    <CardProject projects={currentdata} />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={projects}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No projects available.</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Projects
