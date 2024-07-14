import React, { useEffect, useState } from "react"
import { Container, Row } from "reactstrap"
import axios from "axios"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import Cards
import CardProduct from "./card-product"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

const Products = () => {
  // Meta title
  document.title = "Products Grid "

  const [products, setProducts] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_DATABASEURL + "/products/find-all"
      )
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = products.slice(indexOfFirst, indexOfLast)

  console.log("Current data to be displayed:", currentdata) // Debug: Check current page data

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Products" breadcrumbItem="Product" />

          <Row>
            {/* Import Cards */}
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                {products.length > 0 ? (
                  <>
                    <CardProduct
                      products={currentdata}
                      fetchProduct={fetchProducts}
                    />
                    <Row>
                      <Paginations
                        perPageData={perPageData}
                        data={products}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isShowingPageLength={false}
                        paginationDiv="col-12"
                        paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                      />
                    </Row>
                  </>
                ) : (
                  <p>No products found</p>
                )}
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Products
