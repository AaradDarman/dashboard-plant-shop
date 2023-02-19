import React from "react";

import {
  Button,
  Typography,
  Box,
  Modal,
  Fade,
  Backdrop,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Icon from "components/shared/Icon";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const UserProfileModal = ({ isOpen, onClose, targetCustomer }) => {
  const theme = useTheme();

  return (
    <Modal
      aria-labelledby="edit-product-modal-title"
      aria-describedby="edit-product-modal-description"
      open={isOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle} className="w-[95%] rounded-md md:w-1/2 lg:w-1/3">
          <div className="rounded-md bg-primary-900 p-5">
            <div className="mb-3 flex w-full items-center justify-between border-b-[1px] border-solid  border-b-secondary-dark-800 pb-3">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  پروفایل مشتری
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <div className="flex flex-wrap gap-y-[25px]">
              <Typography
                variant="body1"
                className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
              >
                <span className="ml-[4px] text-gray-400">
                  نام و نام خانوادگی
                </span>
                {`${targetCustomer.fName} ${targetCustomer.lName}`}
              </Typography>
              <Typography
                variant="body1"
                className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
              >
                <span className="ml-[4px] text-gray-400">ایمیل</span>
                {targetCustomer.email}
              </Typography>
              <Typography
                variant="body1"
                className="relative flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
              >
                <span className="ml-[4px] text-gray-400">شماره موبایل</span>
                {targetCustomer.phoneNumber}
              </Typography>
              <Typography
                variant="body1"
                className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
              >
                <span className="ml-[4px] text-gray-400">کد ملی</span>
                {targetCustomer.personalCode}
              </Typography>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserProfileModal;
