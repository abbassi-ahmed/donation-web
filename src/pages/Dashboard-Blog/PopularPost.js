import React from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap"

// import images
import img1 from "../../assets/images/small/img-2.jpg"
import img2 from "../../assets/images/small/img-6.jpg"
import img3 from "../../assets/images/small/img-1.jpg"

const PopularPost = () => {
  const popularpost = [
    {
      id: 1,
      img: img1,
      title: "Belle journée entre amis",
      date: "10 nov. 2020",
      like: "125",
      comment: "68",
    },
    {
      id: 2,
      img: img2,
      title: "Dessin d'un croquis",
      date: "02 nov. 2020",
      like: "102",
      comment: "48",
    },
    {
      id: 3,
      img: img3,
      title: "Vélo sur la route",
      date: "24 oct. 2020",
      like: "98",
      comment: "35",
    },
    {
      id: 4,
      img: img1,
      title: "Discussion de projet avec l'équipe",
      date: "15 oct. 2020",
      like: "92",
      comment: "22",
    },
  ]
  return (
    <React.Fragment>
      <Col xl={8}>
        <Card>
          <CardBody>
            <div className="d-flex">
              <div className="me-2">
                <h5 className="card-title mb-4">Publications populaires</h5>
              </div>
              <UncontrolledDropdown className="ms-auto">
                <DropdownToggle
                  className="text-muted font-size-14"
                  tag="a"
                  color="white"
                >
                  <i className="mdi mdi-dots-horizontal"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <Link className="dropdown-item" to="#">
                    Action
                  </Link>
                  <Link className="dropdown-item" to="#">
                    Autre action
                  </Link>
                  <Link className="dropdown-item" to="#">
                    Autre chose
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="#">
                    Lien séparé
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col" colSpan="2">
                      Publication
                    </th>
                    <th scope="col">J'aime</th>
                    <th scope="col">Commentaires</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {popularpost.map((popularpost, key) => (
                    <tr key={key}>
                      <td style={{ width: "100px" }}>
                        <img
                          src={popularpost.img}
                          alt=""
                          className="avatar-md h-auto d-block rounded"
                        />
                      </td>
                      <td>
                        <h5 className="font-size-13 text-truncate mb-1">
                          <Link to="#" className="text-dark">
                            {popularpost.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-0">{popularpost.date}</p>
                      </td>
                      <td>
                        <i className="bx bx-like align-middle me-1"></i>{" "}
                        {popularpost.like}
                      </td>
                      <td>
                        <i className="bx bx-comment-dots align-middle me-1"></i>{" "}
                        {popularpost.comment}
                      </td>
                      <td>
                        <UncontrolledDropdown className="dropdown">
                          <DropdownToggle
                            className="text-muted font-size-16"
                            tag="a"
                            color="white"
                          >
                            <i className="mdi mdi-dots-horizontal"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <Link className="dropdown-item" to="#">
                              Action
                            </Link>
                            <Link className="dropdown-item" to="#">
                              Autre action
                            </Link>
                            <Link className="dropdown-item" to="#">
                              Autre chose
                            </Link>
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item" to="#">
                              Lien séparé
                            </Link>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default PopularPost
