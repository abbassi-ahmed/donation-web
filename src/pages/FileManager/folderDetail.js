import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import RecentFile from "./RecentFile"
import Storage from "./Storage"
import axios from "axios"
import { Card, CardBody, Container } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"

export default function FolderDetail() {
  const [files, setFiles] = useState({})
  const { id } = useParams()
  const [stats, setStats] = useState({})

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3636/documents/find-documents-by-folder/${id}`
      )
      setFiles(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchStats = async () => {
    console.log("fetching stats")
    try {
      const response = await axios.get(
        `http://localhost:3636/documents/get-sum-size-by-folder/${id}`
      )
      setStats(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchFiles()
    fetchStats()
  }, [])
  const series = [76]
  const options = {
    chart: {
      height: 150,
      type: "radialBar",
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#556ee6"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
        },

        hollow: {
          size: "60%",
        },

        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "16px",
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    stroke: {
      dashArray: 3,
    },
    labels: ["Storage"],
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Apps" breadcrumbItem="File Manager" />
          <div className="d-xl-flex">
            <div className="w-100">
              <div className="d-md-flex">
                {/* FileRightBar  */}
                {/* <FileLeftBar folders={folders} fetchFolders={fetchFolders} /> */}
                <div className="w-100">
                  <Card>
                    <CardBody>
                      <RecentFile
                        files={files}
                        fetchFiles={fetchFiles}
                        fetchStats={fetchStats}
                        folderId={id}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
            <Storage options={options} series={series} stats={stats} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}
