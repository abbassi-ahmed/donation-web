import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import ProductDetail from "./productDetail"
import axios from "axios"

const ProductOverview = () => {
  const { id } = useParams()
  const [productDetail, setProductDetail] = useState({})
  const [error, setError] = useState(null)

  const fetchProductDetail = async productId => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/products/find-one/${productId}`
      )

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`)
      }

      setProductDetail(response.data)
    } catch (error) {
      console.error("Error fetching product detail:", error)
      setError(error.message)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProductDetail(id)
    }
  }, [id])

  if (error) {
    console.error("Error fetching product detail:", error)
    return <div>Error: {error}</div>
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Products" breadcrumbItem="Product Overview" />
          {!isEmpty(productDetail) && (
            <>
              <Row>
                <Col lg="12">
                  <ProductDetail product={productDetail} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

ProductOverview.propTypes = {
  match: PropTypes.object,
}

export default ProductOverview
