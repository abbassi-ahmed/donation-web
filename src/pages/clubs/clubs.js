import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import Cards
import CardClub from "./card-club"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Clubs = () => {
  // Meta title
  document.title = "Clubs Grid"

  const [clubs, setClubs] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const fetchClubs = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/clubs/find-all"
      )
      setClubs(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching clubs:", error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchClubs()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = clubs.slice(indexOfFirst, indexOfLast)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Clubs" breadcrumbItem="Clubs" />

          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {clubs.length > 0 ? (
                  <>
                    <CardClub clubs={currentdata} fetchClubs={fetchClubs} />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={clubs}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No clubs available.</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Clubs
