import { Button } from "react-bootstrap"
import React from "react"

export default function TagFilter({ onTagChange, selectedTags, allTags }) {
  const toggleTag = tag => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    onTagChange(updatedTags)
  }
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {allTags.map(
        tag =>
          tag !== "" && (
            <Button
              key={tag}
              variant={
                selectedTags.includes(tag) ? "primary" : "outline-primary"
              }
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Button>
          )
      )}
    </div>
  )
}
