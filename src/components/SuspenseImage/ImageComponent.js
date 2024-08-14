import React, { useState, useEffect } from "react"
import { Spinner } from "reactstrap"

const ImageLoader = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadImage = async () => {
      if (src) {
        setIsLoading(true) // Set loading state to true
        const img = new Image()
        img.src = src
        img.onload = () => {
          setImageSrc(src)
          setIsLoading(false) // Set loading state to false when loaded
        }
        img.onerror = () => setIsLoading(false) // Handle image load errors
      }
    }
    loadImage()
  }, [src])
  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
          <Spinner color="primary" />
        </div>
      )}
      {imageSrc && !isLoading && <img src={imageSrc} alt={alt} {...props} />}
    </>
  )
}

export default ImageLoader
