import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

import Breadcrumbs from "components/Common/Breadcrumb"

import CardDerigant from "./card-derigant"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Derigants = () => {
  document.title = "Derigants Grid"

  const [derigants, setDerigants] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const fetchDerigants = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/derigant/find-all"
      )
      setDerigants(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching derigants:", error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDerigants()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = derigants.slice(indexOfFirst, indexOfLast)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Derigants" breadcrumbItem="Derigants" />

          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {derigants.length > 0 ? (
                  <>
                    <CardDerigant
                      derigants={currentdata}
                      fetchDerigants={fetchDerigants}
                    />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={derigants}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No derigants available.</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Derigants
