import React, { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import RecentFile from "./RecentFile"
import axios from "axios"
import { Card, CardBody, Container } from "reactstrap"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import Authorized from "./authorized"
import ChildFileList from "./childFileList"

export default function FolderDetail() {
  const [files, setFiles] = useState({})
  const { id } = useParams()
  const location = useLocation()
  const folder = location.state?.folder

  const [authorizedAdmins, setAuthorizedAdmins] = useState([])
  const [folderPrivacy, setFolderPrivacy] = useState("")

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL +
          `
/folders/find-one/${id}`
      )
      setFiles(response.data.documents)
      setAuthorizedAdmins(response.data.authorized_admins)
      setFolderPrivacy(response.data.privacy)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [id])
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Apps" breadcrumbItem={`Folder ${folder.name}`} />
          <div className="d-xl-flex">
            <div className="w-100">
              <div className="d-md-flex">
                <div className="w-100">
                  <Card>
                    <CardBody>
                      <ChildFileList />
                      <RecentFile
                        files={files}
                        fetchFiles={fetchFiles}
                        folderId={id}
                      />
                      {folderPrivacy === "private" && (
                        <div className="mt-3">
                          <Authorized
                            authorizedAdmins={authorizedAdmins}
                            folderId={id}
                            fetchFiles={fetchFiles}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}
