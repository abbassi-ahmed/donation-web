import React from "react"
import {
  Col,
  Container,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from "reactstrap"
import SuspenseImage from "../../components/SuspenseImage/ImageComponent"

const CardUploader = ({ index, cards, setCards, validation }) => {
  const getImageSrc = thumb => {
    return thumb instanceof Blob ? URL.createObjectURL(thumb) : thumb
  }

  const iconSrc = getImageSrc(cards[index].thumb)

  const handleInputChange = (e, cardIndex, field) => {
    const newCards = [...cards]
    newCards[cardIndex] = { ...newCards[cardIndex], [field]: e.target.value }
    setCards(newCards)
  }

  const handleFileChange = (e, cardIndex) => {
    e.preventDefault()
    if (e.target.files.length) {
      const file = e.target.files[0]
      const newCards = [...cards]
      newCards[cardIndex] = { ...newCards[cardIndex], thumb: file }
      setCards(newCards)
      validation.setFieldValue(`cardImage${cardIndex + 1}`, file)
    }
  }

  return (
    <Container>
      <Row className="gap-2">
        <Col
          md={4}
          className="mb-3 justify-content-center align-items-center d-flex flex-column gap-2"
        >
          {[
            { label: "Title", field: "title", type: "text" },
            { label: "Tagline", field: "tagline", type: "text" },
            { label: "Count", field: "count", type: "number" },
            { label: "Bottom Text", field: "bottomText", type: "text" },
            { label: "Item 1", field: "item1", type: "text" },
            { label: "Item 2", field: "item2", type: "text" },
            { label: "Text", field: "text", type: "text" },
          ].map(({ label, field, type }) => (
            <div className="mb-3 w-100" key={field}>
              <Label htmlFor={`card${index + 1}-${field}-input`}>{label}</Label>
              <Input
                id={`card${index + 1}-${field}-input`}
                name={`card${index + 1}-${field}`}
                type={type}
                placeholder={`Enter ${label.toLowerCase()} ${index + 1}...`}
                onChange={e => handleInputChange(e, index, field)}
                value={cards[index][field]}
              />
            </div>
          ))}
        </Col>
        <Col md={7}>
          <div className="position-relative d-inline-block">
            <div className="position-absolute bottom-0 end-0">
              <Label
                htmlFor={`card${index + 1}-image-input`}
                className="mb-0"
                id={`card${index + 1}ImageInput`}
              >
                <div className="avatar-xs">
                  <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                    <i className="bx bxs-image-alt"></i>
                  </div>
                </div>
              </Label>
              <UncontrolledTooltip
                placement="right"
                target={`card${index + 1}ImageInput`}
              >
                Select Image
              </UncontrolledTooltip>
              <input
                className="form-control d-none"
                id={`card${index + 1}-image-input`}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={e => handleFileChange(e, index)}
              />
            </div>
            <div className="mt-3">
              <div className="avatar-title bg-light">
                {cards[index].thumb ? (
                  <div
                    style={{
                      width: "550px",
                      minHeight: "550px",
                    }}
                  >
                    <SuspenseImage
                      src={iconSrc}
                      id={`card${index + 1}-img`}
                      alt="Project Logo"
                      className="img-fluid avatar-md overflow-hidden"
                      style={{
                        maxWidth: "100%",
                        width: "550px",
                        minHeight: "550px",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="img-fluid avatar-md overflow-hidden"
                    style={{
                      maxWidth: "100%",
                      width: "550px",
                      minHeight: "550px",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CardUploader
