import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import RecentFile from "./RecentFile"
import Storage from "./Storage"
import axios from "axios"
import { Card, CardBody, Container } from "reactstrap"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import Authorized from "./authorized"
import ChildFileList from "./childFileList"

export default function FolderDetail() {
  const [files, setFiles] = useState({})
  const { id } = useParams()
  const [stats, setStats] = useState({})
  const [authorizedAdmins, setAuthorizedAdmins] = useState([])
  const [folderPrivacy, setFolderPrivacy] = useState("")

  const fetchFiles = async () => {
    try {
      const response = await axios.get(
        `http://194.164.54.216:3636
/folders/find-one/${id}`
      )
      setFiles(response.data.documents)
      setAuthorizedAdmins(response.data.authorized_admins)
      setFolderPrivacy(response.data.privacy)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `http://194.164.54.216:3636
/documents/get-sum-size-by-folder/${id}`
      )
      setStats(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchFiles()
    fetchStats()
  }, [id])

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
                      <ChildFileList />
                      <RecentFile
                        files={files}
                        fetchFiles={fetchFiles}
                        fetchStats={fetchStats}
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
            <Storage stats={stats} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}
