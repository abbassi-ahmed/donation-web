import { Card, Button } from "react-bootstrap"
import React from "react"

export default function ImageCard({ image, onRemove }) {
  return (
    <Card className="h-100">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={image.image || "/placeholder.svg"}
          alt="Gallery image"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 p-2">
          <Button variant="danger" size="sm" onClick={() => onRemove(image.id)}>
            <i className="bx bx-trash"></i>
          </Button>
        </div>
      </div>
      <Card.Body>
        <div className="d-flex flex-wrap gap-1">
          {image.tags.map(tag => (
            <span key={tag} className="badge bg-primary">
              {tag}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}
