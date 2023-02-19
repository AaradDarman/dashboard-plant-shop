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
import { useDispatch, useSelector } from "react-redux";
import Icon from "components/shared/Icon";
import { useEffect } from "react";
import { getOrders } from "redux/slices/customer";
import CustomerOrder from "components/customers/CustomerOrder";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const UserOrdersModal = ({ isOpen, onClose, targetCustomer }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.customer);

  useEffect(() => {
    if (isOpen) dispatch(getOrders(targetCustomer._id));
  }, [isOpen]);

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
        <Box sx={modalStyle} className="w-[95%] rounded-md md:w-1/2">
          <div className="flex max-h-[94vh] flex-col overflow-hidden rounded-md bg-primary-900 p-5">
            <div className="mb-3 flex w-full items-center justify-between border-b-[1px] border-solid  border-b-secondary-dark-800 pb-3">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  سفارش های مشتری
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto">
              {orders.map((order) => (
                <CustomerOrder key={order._id} order={order} />
              ))}
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserOrdersModal;
