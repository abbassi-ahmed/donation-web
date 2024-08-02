import React, { useState } from "react"
import { useDropzone } from "react-dropzone"

const DropZone = ({ onDrop, fileName }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept:
        "image/*, application/pdf, .doc, .docx, .txt, .xls, .xlsx, .ppt, .pptx, .zip, .rar",
      multiple: false,
    })
  const backgroundColor = isDragActive || fileName ? "#e0ffe0" : "#f9f9f9"

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #cccccc",
        borderRadius: "5px",
        height: "150px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: backgroundColor,
        color: isDragReject ? "#ff0000" : "#000000",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : fileName ? (
        <p
          style={{
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          File exists: {fileName}
        </p>
      ) : (
        <p
          style={{
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          Drag 'n' drop some file here, or click to select file
        </p>
      )}
    </div>
  )
}

export default DropZone
