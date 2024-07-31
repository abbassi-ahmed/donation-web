import React from "react"
import { Link } from "react-router-dom"
import {
  Table,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
} from "reactstrap"
import axios from "axios"
import "./styles.css"

const RecentFile = ({ files, fetchFiles }) => {
  const removeFile = async id => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_DATABASEURL}/documents/remove/${id}`)
        .then(res => {
          fetchFiles()
        })
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  return (
    <React.Fragment>
      <div className="mt-4">
        <div className="d-flex flex-wrap">
          <h5 className="font-size-16 me-3">Recent Files</h5>
          <div className="ms-auto"></div>
        </div>
        <hr className="mt-2" />

        <div className="table-responsive custom-dropdown-menu">
          <Table className="table align-middle table-nowrap table-hover mb-0">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Created At</th>
                <th scope="col" colSpan="2">
                  Size
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 &&
                files?.map((item, key) => (
                  <tr key={key}>
                    <td>
                      <Link to="#" className="text-dark fw-medium">
                        <i
                          className={item.icon ? item.icon : "bx bxs-file"}
                        ></i>
                        {item.name}
                      </Link>
                    </td>
                    <td>{new Date(item.createdAt).toDateString()} </td>
                    <td>{item.size} </td>
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          className="font-size-16 text-muted"
                          role="button"
                        >
                          <i className="mdi mdi-dots-horizontal"></i>
                        </DropdownToggle>

                        <DropdownMenu className="dropdown-menu-end ">
                          <DropdownItem
                            href={
                              item.mimeTypes === "image"
                                ? item.files
                                : `${process.env.REACT_APP_DATABASEURL}/${item.files}`
                            }
                            target="_blank"
                          >
                            Open
                          </DropdownItem>
                          <DropdownItem href="#">Rename</DropdownItem>
                          <div className="dropdown-divider"></div>
                          <DropdownItem onClick={() => removeFile(item.id)}>
                            Remove
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  )
}

export default RecentFile
