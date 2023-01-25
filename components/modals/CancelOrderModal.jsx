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
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DotDevider from "components/shared/DotDevider";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const CancelOrderModal = ({ isOpen, onClose, onCancelClick, targetOrders }) => {
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
          <div className="rounded-md bg-white p-5 dark:bg-primary-900">
            <div className="flex w-full items-center justify-between pb-3">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  حذف محصول
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Typography variant="body1" className="py-3">
              {targetOrders.length > 1
                ? "آیا از کنسل کردن این سفارش ها از لیست سفارش ها اطمینان دارید؟"
                : "آیا از کنسل کردن این سفارش از لیست سفارش ها اطمینان دارید؟"}
            </Typography>
            <div className="flex flex-wrap">
              {targetOrders.map((order) => (
                <>
                  <span key={order._id}>{order.orderNumber}</span>
                  <DotDevider className="last:!hidden" />
                </>
              ))}
            </div>
            <Stack spacing={1} direction="row" className="action-buttons mt-3">
              <Button
                variant="text"
                size="small"
                onClick={onClose}
                color="grey"
              >
                لغو
              </Button>
              <Button
                onClick={onCancelClick}
                variant="contained"
                className="!bg-accent-700 !text-white hover:!bg-accent-800"
                size="small"
              >
                تایید
              </Button>
            </Stack>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CancelOrderModal;
