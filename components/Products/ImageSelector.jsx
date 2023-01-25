import { FormHelperText } from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";

import styled from "styled-components";
import ImageItem from "./ImageItem";

const Wraper = styled.div`
  .banner-upload-wraper {
    width: 248px;
    min-height: 248px;
    background: inherit;
    color: inherit;
    cursor: pointer;
    display: flex;
    border: 1px solid;
    border-color: ${({ theme, error }) =>
      error ? theme.palette.error.main : "rgba(255, 255, 255, 0.23)"};
    border-radius: 0.3rem;
    overflow: hidden;
    font-size: 15px;
    align-items: center;
    justify-content: center;
    outline: ${({ isEmpty }) => isEmpty && "2px dashed gray"};
    outline-offset: -10px;
  }
  .banner-upload-label {
    cursor: pointer;
    min-height: inherit;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    z-index: 1;
  }
  .banner-upload-input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .banner-preview {
    width: 100%;
    max-height: 60vh;
  }
`;

const ImageSelector = ({
  images,
  onChange,
  intent,
  className,
  error,
  helperText,
}) => {
  const [imageUrls, setImageUrls] = useState([]);

  const handleImagesUpload = (event) => {
    if (event.target.files) {
      onChange([...event.target.files]);
    }
  };

  const handleAddImage = (event) => {
    if (event.target.files[0]) {
      onChange([...images, event.target.files[0]]);
    }
  };

  const handleRemoveImage = (name) => {
    onChange(images.filter((image) => image.name != name));
  };

  useEffect(() => {
    const newImageUrls = [];
    images.forEach((image) => {
      if (typeof image === "string") {
        newImageUrls.push(image);
      } else {
        newImageUrls.push(URL.createObjectURL(image));
      }
    });
    setImageUrls(newImageUrls);
  }, [images]);

  return (
    <Wraper
      className={`rtl ${className}`}
      error={error}
      isEmpty={!images.length}
    >
      <form encType="multipart/form-data">
        <div className={`banner-upload-wraper ${intent}`}>
          {images.length ? (
            <div className="flex w-[248px] flex-wrap justify-center">
              {images.map((image, index) => (
                <ImageItem
                  key={image.name}
                  image={image}
                  onDelete={() => handleRemoveImage(image.name)}
                />
              ))}
              <label
                htmlFor="product-image"
                className="mr-[4px] mb-[4px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-[5px] bg-white/[.23]"
              >
                +
              </label>
            </div>
          ) : (
            <label htmlFor="product-images" className="banner-upload-label">
              تصویر محصول
            </label>
          )}
        </div>
        <input
          type="file"
          multiple
          id="product-images"
          name="productImages"
          aria-describedby="productImages"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          className="banner-upload-input"
          onChange={handleImagesUpload}
        />
        <input
          type="file"
          id="product-image"
          name="productImages"
          aria-describedby="productImage"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          className="banner-upload-input"
          onChange={handleAddImage}
        />
      </form>
      <FormHelperText error={error} id="images-error" className="!mx-[14px]">
        {helperText}
      </FormHelperText>
    </Wraper>
  );
};

export default ImageSelector;
