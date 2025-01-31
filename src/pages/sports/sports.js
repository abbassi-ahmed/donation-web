import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import Cards
import CardSport from "./sport-sport"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Sports = () => {
  // Meta title
  document.title = "Sports Grid"

  const [sports, setSports] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const fetchSports = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/sports/find-all"
      )
      setSports(response.data)
      console.log(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching sports:", error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSports()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = sports.slice(indexOfFirst, indexOfLast)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Sports" breadcrumbItem="Sports" />

          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {sports.length > 0 ? (
                  <>
                    <CardSport sports={currentdata} fetchSports={fetchSports} />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={sports}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No sports available.</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Sports
