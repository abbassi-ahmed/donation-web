import React, { useEffect } from "react"
import { Input, Label, UncontrolledTooltip } from "reactstrap"

const ListPoints = ({ index, listPoints, setListPoints }) => {
  const handleTitleChange = (e, listPointIndex) => {
    const newListPoints = [...listPoints]
    newListPoints[listPointIndex] = {
      ...newListPoints[listPointIndex],
      title: e.target.value,
    }
    setListPoints(newListPoints)
  }

  const handleTextChange = (e, listPointIndex) => {
    const newListPoints = [...listPoints]
    newListPoints[listPointIndex] = {
      ...newListPoints[listPointIndex],
      text: e.target.value,
    }
    setListPoints(newListPoints)
  }

  return (
    <div>
      <div className="mb-3">
        <Label htmlFor={`listPoints${index + 1}-title-input`}>
          Title {index + 1}
        </Label>
        <Input
          id={`PointTitle${index + 1}`}
          name={`PointTitle${index + 1}`}
          type="text"
          placeholder={`Enter Title ${index + 1}...`}
          onChange={e => handleTitleChange(e, index)}
          value={listPoints[index].title}
        />
      </div>
      <div className="mb-3">
        <Label htmlFor={`listPoints${index + 1}-text-input`}>
          Text {index + 1}
        </Label>
        <Input
          id={`PointText${index + 1}`}
          name={`PointText${index + 1}`}
          type="text"
          placeholder={`Enter Text ${index + 1}...`}
          onChange={e => handleTextChange(e, index)}
          value={listPoints[index].text}
        />
      </div>
    </div>
  )
}
export default ListPoints
