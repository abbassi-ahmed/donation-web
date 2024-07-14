import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import TableContainer from "components/Common/TableContainer"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import axios from "axios"

const ProductPayments = () => {
  document.title = "Product Payment"

  const [products, setProducts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DATABASEURL}/users-products/find-all`
        )
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggle = () => {
    setModal(!modal)
  }

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "avatar",
        cell: cell => (
          <>
            {!cell.getValue() ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">
                  <img
                    src={cell.row.original.user.avatar}
                    alt=""
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </span>
              </div>
            ) : (
              <img
                className="rounded-circle avatar-xs"
                src={cell.getValue()}
                alt=""
              />
            )}
          </>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "First Name",
        accessorKey: "firstName",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.firstName}
          </Link>
        ),
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.lastName}
          </Link>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.user.email}
          </Link>
        ),
      },

      {
        header: "Product Picture",
        accessorKey: "productPicture",
        cell: cellProps => (
          <div className="avatar-xs">
            <span className="avatar-title rounded-circle">
              <img
                src={cellProps.row.original.product.image}
                alt=""
                width={40}
                height={40}
                style={{ objectFit: "contain" }}
              />
            </span>
          </div>
        ),
      },
      {
        header: "Name Product",
        accessorKey: "name",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.product.name}
          </Link>
        ),
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.product.price} TND
          </Link>
        ),
      },

      {
        header: "Quantity",
        accessorKey: "quantity",
        cell: cellProps => (
          <Link to="#" className="text-dark">
            {cellProps.row.original.amount}
          </Link>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Products" breadcrumbItem="Payments" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h4 className="card-title">User List</h4>
                      {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUserClicks}
                      >
                        Add User
                      </button> */}
                    </div>
                    <TableContainer columns={columns} data={products} />
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>

      <ToastContainer />
    </React.Fragment>
  )
}

export default ProductPayments
