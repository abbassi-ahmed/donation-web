import { Container } from "react-bootstrap"
import React from "react"
import ImageGallery from "components/gallerie/ImageGallery"
export default function Home() {
  return (
    <div className="page-content">
      <Container fluid>
        <ImageGallery />
      </Container>
    </div>
  )
}
