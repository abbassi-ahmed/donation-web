import React from "react"
import PropTypes from "prop-types"
import { Card, CardBody, Col, Row } from "reactstrap"

const ProductDetail = ({ product }) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg="6">
            <div className="d-flex align-items-center justify-content-center">
              <img
                src={product.image}
                alt=""
                className="avatar-lg"
                style={{
                  width: "450px",
                  height: "450px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </Col>
          <Col lg="6">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <h5 className="text-truncate font-size-20">Product Name: </h5>
                <p className="text-muted font-size-16">{product.name}</p>
                <h5 className="text-truncate font-size-20">
                  Product Description:
                </h5>
                <p className="text-muted font-size-16">{product.description}</p>
                <h5 className="text-truncate font-size-20">Product Price:</h5>
                <p className="text-muted font-size-16">${product.price}</p>
                <h5 className="text-truncate font-size-20">
                  Product Quantity:
                </h5>
                <p className="text-muted font-size-16">
                  {product.quantity} in stock
                </p>
                <h5 className="text-truncate font-size-20">
                  Product Added At:
                </h5>
                <p className="text-muted font-size-16">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
}

export default ProductDetail
