import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import ClubDetail from "./clubDetail"
import axios from "axios"

const ClubsOverview = () => {
  document.title = "Club Overview"

  const { id } = useParams()
  const [clubDetail, setClubDetail] = useState({})
  const [error, setError] = useState(null)
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authUser"))
        if (!token) {
          throw new Error("Token not found")
        }
        const response = await axios.post(
          process.env.REACT_APP_DATABASEURL + "/admins/verify",
          { token: token }
        )
        const profile = response.data
        setUser(profile)
      } catch (err) {
        console.error("Error fetching profile data", err)
      }
    }
    fetchProfile()
  }, [])

  const fetchClubDetail = async clubId => {
    try {
      const clubResponse = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/clubs/find-one/${clubId}`
      )
      setClubDetail(clubResponse.data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchClubDetail(id)
    }
  }, [id])

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Clubs" breadcrumbItem="Club Overview" />
          {!isEmpty(clubDetail) && (
            <Row className="align-items-center justify-content-center">
              <Col lg="8">
                <ClubDetail
                  club={clubDetail}
                  fetchClubDetail={fetchClubDetail}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ClubsOverview
