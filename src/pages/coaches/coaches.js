import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import Cards
import CardProject from "./card-coach"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Coaches = () => {
  // Meta title
  document.title = "Coaches Grid | Skote - React Admin & Dashboard Template"

  const [coaches, setCoaches] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_DATABASEURL + "/coach/find-all"
        )
        setCoaches(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching Coaches:", error)
        setLoading(false)
      }
    }
    fetchCoaches()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = coaches.slice(indexOfFirst, indexOfLast)

  console.log("Current data to be displayed:", currentdata) // Debug: Check current page data

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Coaches" breadcrumbItem="Coaches" />

          <Row>
            {/* Import Cards */}
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {coaches.length > 0 ? (
                  <>
                    <CardProject coaches={currentdata} />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={coaches}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No coaches available.</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Coaches
