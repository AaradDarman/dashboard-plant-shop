import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  useTheme,
  Box,
  Modal,
  Fade,
  Backdrop,
  Stack,
  IconButton,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const ChargeProductQuantityModal = ({
  isOpen,
  onClose,
  onSave,
  targetProduct,
}) => {
  const theme = useTheme();

  const ChargeQuantitySchema = Yup.object().shape({
    quantity: Yup.string()
      .test(
        "Is positive?",
        "عدد وارد شده باید بزرگتر از 0 باشد",
        (value) => +value > 0
      )
      .test(
        "Is Less Than 100?",
        "عدد وارد شده باید کوچکتر از 1000 باشد",
        (value) => +value < 1000
      )
      .required("پر کردن این فیلد الزامی می باشد"),
  });

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
        <Box sx={modalStyle} className="w-[95%] rounded-md md:w-1/2 lg:w-1/4">
          <div className="flex flex-col rounded-md bg-white p-5 dark:bg-primary-900">
            <div className="mb-3 flex w-full items-center justify-between border-b-[1px] border-solid border-b-secondary-dark-200 pb-3 dark:border-b-secondary-dark-800">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  افزایش موجودی محصول
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Formik
              initialValues={{
                quantity: "",
              }}
              enableReinitialize={false}
              validationSchema={ChargeQuantitySchema}
              onSubmit={onSave}
            >
              {({
                values,
                handleBlur,
                errors,
                touched,
                setFieldValue,
                handleSubmit,
              }) => (
                <>
                  <span
                    style={{
                      color: theme.palette.error.main,
                      display: "inline-block",
                      padding: "0 4px",
                    }}
                  >
                    {`${targetProduct.name} ${targetProduct.size}`}
                  </span>
                  <TextField
                    variant="outlined"
                    label="تعداد"
                    size="small"
                    margin="dense"
                    required
                    fullWidth
                    autoComplete="off"
                    value={values.quantity}
                    type="number"
                    onChange={(e) => {
                      setFieldValue("quantity", e.target.value);
                    }}
                    onBlur={handleBlur("quantity")}
                    error={errors.quantity && touched.quantity}
                    helperText={
                      errors.quantity && touched.quantity
                        ? errors.quantity
                        : " "
                    }
                    FormHelperTextProps={{ style: { marginBottom: "4px" } }}
                    sx={{
                      "& label.Mui-focused": {
                        color: "accent.main",
                      },
                      "& label.Mui-focused.Mui-error": {
                        color: "error.main",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "accent.main",
                        },
                        "&.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "error.main",
                          },
                      },
                    }}
                    inputProps={{ className: "bg-transparent" }}
                  />
                  <Stack
                    spacing={1}
                    direction="row"
                    className="action-buttons mt-3"
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={onClose}
                      color="grey"
                    >
                      لغو
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      className="!bg-accent-700 !text-white hover:!bg-accent-800"
                      size="small"
                    >
                      ذخیره
                    </Button>
                  </Stack>
                </>
              )}
            </Formik>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ChargeProductQuantityModal;
