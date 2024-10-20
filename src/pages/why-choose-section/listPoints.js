import React from "react"
import { Input, Label } from "reactstrap"

export default function ListPoints({ index, listPoints, setListPoints }) {
  const handleInputChange = (e, field) => {
    const { value } = e.target
    setListPoints(prevPoints =>
      prevPoints.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      )
    )
  }

  const currentPoint = listPoints[index]

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`point-title-${index}`}>Title {index + 1}</Label>
        <Input
          id={`point-title-${index}`}
          name={`point-title-${index}`}
          type="text"
          placeholder={`Enter Title ${index + 1}...`}
          onChange={e => handleInputChange(e, "title")}
          value={currentPoint.title}
        />
      </div>
      <div>
        <Label htmlFor={`point-text-${index}`}>Text {index + 1}</Label>
        <Input
          id={`point-text-${index}`}
          name={`point-text-${index}`}
          type="text"
          placeholder={`Enter Text ${index + 1}...`}
          onChange={e => handleInputChange(e, "text")}
          value={currentPoint.text}
        />
      </div>
    </div>
  )
}
