import React, { useEffect, useState } from "react"
import { Card, CardBody, Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// import Component
import FileList from "./FileList"
import axios from "axios"

const Index = () => {
  //meta title
  document.title = "File Manager | Skote - React Admin & Dashboard Template"

  const [folders, setFolders] = useState({})
  const [user, setUser] = useState({})

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("admin"))
    setUser(storedUser)
  }, [])

  useEffect(() => {
    if (user && user.id) {
      fetchFolders()
    }
  }, [user])

  const fetchFolders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3636/folders/find-by-admin/${user.id}`
      )
      const foldersWithDocumentCount = response.data.map(folder => ({
        ...folder,
        documentCount: folder.documents.length,
      }))
      setFolders(foldersWithDocumentCount)
    } catch (error) {
      console.log(error)
    }
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
                      <FileList folders={folders} fetchFolders={fetchFolders} />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
            {/* <Storage options={options} series={series} stats={stats} /> */}
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default Index
