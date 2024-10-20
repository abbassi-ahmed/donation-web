import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import ProjectDetail from "./projectDetail"
import TeamMembers from "./teamMembers"
import OverviewChart from "./overviewChart"
import axios from "axios"
import { io } from "socket.io-client"

const ProjectsOverview = () => {
  // Meta title
  document.title = "Project Overview"

  const { id } = useParams()
  const [projectDetail, setProjectDetail] = useState({})
  const [error, setError] = useState(null)
  const [donators, setDonators] = useState([])
  const [sum, setSum] = useState(0)
  const [chartData, setChartData] = useState({ options: {}, series: [] })
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
        const socket = io("wss://api.olympiquemnihla.com", {
          query: {
            client: JSON.stringify(user),
          },
        })

        socket.on("AddDonation", () => {
          fetchProjectDetail(id)
        })
      } catch (err) {
        console.error("Error fetching profile data", err)
      }
    }
    fetchProfile()
  }, [])

  const fetchProjectDetail = async projectId => {
    try {
      const projectResponse = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/projects/find-one/${projectId}`
      )
      setProjectDetail(projectResponse.data)

      await axios
        .get(
          `${process.env.REACT_APP_DATABASEURL}/project-donation/get-sum-of-donations/${projectId}`
        )
        .then(response => {
          setSum(response.data.sum)
        })

      const donationResponse = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/project-donation/find-by-project-id/${projectId}`
      )
      setDonators(donationResponse.data)

      const chartSeries = [
        {
          name: "Donations",
          data: donationResponse.data.map(donation => ({
            x: donation.user.firstName,
            y: donation.amount,
          })),
        },
      ]

      const chartOptions = {
        chart: {
          type: "bar",
        },
        xaxis: {
          type: "category",
        },
        yaxis: {
          title: {
            text: "Amount",
          },
        },
        title: {
          text: "Donation Overview",
          align: "left",
        },
      }

      setChartData({ options: chartOptions, series: chartSeries })
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProjectDetail(id)
    }
  }, [id])

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
                  <ProjectDetail project={projectDetail} sum={sum} />
                </Col>

                <Col lg="4">
                  <TeamMembers team={donators} sum={sum} />
                </Col>
              </Row>

              <Row>
                <Col lg="12">
                  <OverviewChart
                    options={chartData.options}
                    series={chartData.series}
                  />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ProjectsOverview
