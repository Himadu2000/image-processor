import axios from "axios"
import { MDBBtn } from "mdbreact"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "../../image"
// import "./style.sass"

const IndexPage = () => {
  const [images, setImages] = useState<any[]>()
  const [processedImages, setProcessedImages] = useState<any[]>()
  const [quality, setQuality] = useState("0")
  const [greyscale, setGreyscale] = useState(false)

  const onDrop = useCallback(acceptedFiles => {
    let imageList = []
    if (images) {
      imageList.push(...images, acceptedFiles)
    } else {
      imageList = acceptedFiles
    }
    setImages(imageList)
  }, [])

  async function convert() {
    const form = new FormData()
    images.forEach(file => {
      form.append("photos", file)
    })
    if (greyscale) {
      form.append("greyscale", "true")
    } else {
      form.append("greyscale", "")
    }
    form.append("quality", quality)

    const ServerURL = "http://localhost:3000/"

    const response = await axios({
      method: "post",
      url: ServerURL,
      headers: { "Content-Type": "multipart/form-data" },
      data: form,
    })

    setProcessedImages(response.data)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>
            Drop the files here ...
            <Image />
          </div>
        ) : (
          <div>
            Drag 'n' drop some files here, or click to select files
            <Image />
          </div>
        )}
      </div>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customSwitches"
          checked={greyscale}
          onChange={() => setGreyscale(!greyscale)}
          readOnly
        />
        <label className="custom-control-label" htmlFor="customSwitches">
          Toggle this switch element
        </label>
      </div>
      <div className="my-5">
        <label htmlFor="customRange1">Quality range</label>
        <input
          type="range"
          min={0}
          max={100}
          value={quality}
          onChange={({ currentTarget }) => setQuality(currentTarget.value)}
          className="custom-range"
          id="customRange1"
        />
      </div>
      <MDBBtn onClick={() => convert()}>Convert</MDBBtn>
      {processedImages ? (
        <>
          Preview -
          <ul>
            {processedImages.map((image, index) => {
              return <img key={index} src={image} height="100" />
            })}
          </ul>
        </>
      ) : null}
    </>
  )
}

export default IndexPage
