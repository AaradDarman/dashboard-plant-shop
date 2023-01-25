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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const RemoveProductDiscountModal = ({
  isOpen,
  onClose,
  onRemove,
  targetProductForRemove,
}) => {
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
          <div className="rounded-md bg-white p-5 dark:bg-primary-900">
            <div className="flex w-full items-center justify-between pb-3">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  حذف تخفیف
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Typography variant="body1" className="py-3">
              آیا از حذف
              <span
                style={{
                  color: theme.palette.error.main,
                  display: "inline-block",
                  padding: "0 4px",
                }}
              >
                {targetProductForRemove}
              </span>
              از لیست تخفیفات اطمینان دارید؟
            </Typography>
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
                onClick={onRemove}
                variant="contained"
                className="!bg-accent-700 !text-white hover:!bg-accent-800"
                size="small"
              >
                حذف
              </Button>
            </Stack>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RemoveProductDiscountModal;
