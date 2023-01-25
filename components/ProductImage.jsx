import React, { useState, useEffect } from "react";

import Image from "next/image";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

import useBreakpoints from "utils/useBreakPoints";

const ImageRadio = ({ image, index, ...otherProps }) => {
  return (
    <Radio
      sx={{
        "&": {
          minWidth: "50px",
          minHeight: "50px",
          padding: "2px",
          border: "1px solid transparent",
        },
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
      disableRipple
      color="default"
      checkedIcon={
        <Image
          alt={`product-img-${index}`}
          width={50}
          height={50}
          src={image.src}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="rounded-md"
        />
      }
      icon={
        <Image
          alt={`product-img-${index}`}
          width={50}
          height={50}
          src={image.src}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="rounded-md"
        />
      }
      {...otherProps}
    />
  );
};

const ProductImage = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const { isMd } = useBreakpoints();

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  return (
    <div className="flex flex-col md:flex-row">
      <Image
        src={selectedImage.src}
        alt="product-image"
        width={512}
        height={512}
        className="rounded-md drop-shadow-xl"
        placeholder="blur"
        blurDataURL={selectedImage.blurDataURL}
        priority
      />
      <RadioGroup
        aria-labelledby="selected-image-index"
        defaultValue={selectedImage.src}
        name="selected-index-radio-buttons-group"
        value={selectedImage.src}
        row={!isMd}
        onChange={(event) => {
          setSelectedImage(
            images.find((img) => img.src === event.target.value)
          );
        }}
        className="flex-row flex-nowrap overflow-x-auto md:max-h-[512px] md:flex-col md:overflow-y-auto md:overflow-x-hidden"
        sx={{
          "& .Mui-checked": {
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "0.5rem",
          },
        }}
      >
        {images.map((img, index) => (
          <FormControlLabel
            key={img.src}
            value={img.src}
            className="!ml-0 !mr-0"
            control={<ImageRadio image={img} index={index} />}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default ProductImage;
