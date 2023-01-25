import React from "react";

import styled from "styled-components";
import { lighten } from "polished";
import { IconButton } from "@mui/material";
import Image from "next/image";
import Icon from "components/shared/Icon";

const Wraper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  margin-right: 4px;
  margin-bottom: 4px;
  :first-child {
    width: 200px;
    height: 200px;
  }
  img {
    border-radius: 5px;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #141921;
    opacity: 0;
    transition: inherit;
  }

  :hover .overlay {
    opacity: 0.3;
  }

  .delete-btn {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :hover .delete-btn {
    display: inline-flex;
  }
`;

const ImageItem = ({ image, onDelete }) => {
  return (
    <Wraper className="product-image">
      <Image
        src={typeof image === "string" ? image : URL.createObjectURL(image)}
        alt="product-pic"
        layout="fill"
      />
      <div className="overlay"></div>
      <IconButton
        color="error"
        aria-label="delete color"
        className="delete-btn"
        onClick={onDelete}
      >
        <Icon icon="delete" size={24} />
      </IconButton>
    </Wraper>
  );
};

export default ImageItem;
