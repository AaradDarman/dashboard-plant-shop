import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  Typography,
  useTheme,
  Box,
  Modal,
  Fade,
  Backdrop,
  Stack,
  Divider,
  FilledInput,
  TextField,
} from "@mui/material";
import OtpInput from "react-otp-input";
import { Formik } from "formik";
import * as Yup from "yup";

import CountDownTimer from "components/CountDownTimer";
import { authContext } from "context/auth-context";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const SendOrderModal = ({ isOpen, onClose, targetOrder, onSend }) => {
  const [postTrackingNumber, setPostTrackingNumber] = useState("");

  const postTrackingSchema = Yup.object().shape({
    postTrackingNumber: Yup.string()
      .matches(/^\d+$/, "فرمت کد پستی صحیح نمی باشد")
      .test(
        "len",
        "کد پستی باید 24 رقم باشد",
        (val) => val && val.toString().length === 24
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
          <Formik
            initialValues={{
              postTrackingNumber,
            }}
            enableReinitialize={false}
            validationSchema={postTrackingSchema}
            onSubmit={onSend}
          >
            {({
              values,
              handleBlur,
              errors,
              touched,
              setFieldValue,
              handleSubmit,
            }) => (
              <div
                className="rounded-md bg-white p-5 dark:bg-primary-900"
                // error={errors.verificationCode && touched.verificationCode}
              >
                <Typography
                  variant="h5"
                  marginBottom={2}
                  className="text-center"
                >
                  ارسال بسته
                </Typography>
                <Typography variant="body1" className="!my-2 font-mono">
                  <span className="ml-[8px] font-Byekan text-gray-400">
                    شماره سفارش
                  </span>
                  {targetOrder.orderNumber}
                </Typography>
                <TextField
                  variant="outlined"
                  label="کد پیگیری پست"
                  size="small"
                  margin="dense"
                  required
                  fullWidth
                  value={postTrackingNumber}
                  type="number"
                  onChange={(e) => {
                    setPostTrackingNumber(e.target.value);
                    setFieldValue("postTrackingNumber", e.target.value);
                  }}
                  onBlur={handleBlur("postTrackingNumber")}
                  error={
                    errors.postTrackingNumber && touched.postTrackingNumber
                  }
                  helperText={
                    errors.postTrackingNumber && touched.postTrackingNumber
                      ? errors.postTrackingNumber
                      : " "
                  }
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
                    onClick={() => {
                      onClose();
                      setPostTrackingNumber("");
                    }}
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
              </div>
            )}
          </Formik>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SendOrderModal;
