import React, { useEffect, useState } from "react"
import axios from "axios"
import { debounce } from "lodash"
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap"
import TagFilter from "./tagFilter"
import ImageCard from "./ImageCard"
import Pagination from "./pagination"
import UploadModal from "./uploadModal"

export default function ImageGallery() {
  const [images, setImages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loader, setLoader] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])

  const rowsPerPage = 20

  const [paginationParams, setPaginationParams] = useState({
    pageNumber: page,
    pageSize: rowsPerPage,
    sortOrder: "DESC",
  })
  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASEURL}/gallerie/find-tags`
      )

      setAllTags(response.data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }
  // const fetchFiles = async () => {
  //   try {
  //     setLoader(true)
  //     const params = new URLSearchParams({
  //       pageNumber: page.toString(),
  //       pageSize: paginationParams.pageSize.toString(),
  //       sortOrder: paginationParams.sortOrder,
  //       tags: selectedTags.join(","),
  //     })
  //     const response = await axios.get(
  //       `${
  //         process.env.REACT_APP_DATABASEURL
  //       }/gallerie/find?${params.toString()}`
  //     )
  //     setImages(response.data.data)
  //     setTotalPages(response.data.pageCount)
  //     setLoader(false)
  //     fetchTags()
  //   } catch (error) {
  //     console.error("Error fetching files:", error)
  //     setLoader(false)
  //   }
  // }
  const fetchFiles = async () => {
    try {
      setLoader(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: paginationParams.pageSize.toString(),
      })
      const response = await axios.post(
        `${
          process.env.REACT_APP_DATABASEURL
        }/gallerie/filter-by-tags?${params.toString()}`,
        {
          tags: selectedTags,
        }
      )
      console.log(response.data)
      setImages(response.data.data)
      setTotalPages(Math.ceil(response.data.total / rowsPerPage))

      setLoader(false)
      fetchTags()
    } catch (error) {
      console.error("Error fetching files:", error)
      setLoader(false)
    }
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleTagFilter = tag => {
    setSelectedTags(tag)

    setPage(1)
  }

  useEffect(() => {
    fetchFiles()
  }, [page, selectedTags, paginationParams.searchQuery])
  useEffect(() => {
    fetchTags()
  }, [])

  const removeImage = async id => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DATABASEURL}/gallerie/remove/${id}`
      )
      fetchFiles()
      fetchTags()
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <div className="d-flex justify-content-between">
          <p></p>
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Upload Image
          </Button>
        </div>
      </Row>

      <TagFilter
        onTagChange={handleTagFilter}
        selectedTags={selectedTags}
        allTags={allTags}
      />

      {loader ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-muted">No images available.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {images.map(image => (
            <Col key={image.id}>
              <ImageCard image={image} onRemove={removeImage} />
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <UploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUploadComplete={fetchFiles}
      />
    </Container>
  )
}
