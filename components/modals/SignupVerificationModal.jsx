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

const SignupVerificationModal = ({ open, onClose, onVerify, onResendOtp }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const theme = useTheme();
  const { tokenCreateDate } = useContext(authContext);

  const handleResendOtp = () => {
    onResendOtp();
  };

  const VerificationSchema = Yup.object().shape({
    verificationCode: Yup.string()
      .min(6, "کد وارد شده باید 6 رقم باشد")
      .max(6, "کد وارد شده باید 6 رقم باشد")
      .test(
        "Is positive?",
        "ERROR: The number must be greater than 0!",
        (value) => +value > 0
      )
      .required("پر کردن این فیلد الزامی می باشد"),
  });

  return (
    <Modal
      aria-labelledby="edit-product-modal-title"
      aria-describedby="edit-product-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle} className="w-[95%] rounded-md md:w-1/2 lg:w-1/3">
          <Formik
            initialValues={{
              verificationCode,
            }}
            enableReinitialize={false}
            validationSchema={VerificationSchema}
            onSubmit={onVerify}
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
                  فعال سازی حساب کاربری
                </Typography>
                <OtpInput
                  value={verificationCode}
                  onChange={(val) => {
                    setVerificationCode(val);
                    setFieldValue("verificationCode", val);
                  }}
                  numInputs={6}
                  separator={<span className="w-1"></span>}
                  containerStyle="flex justify-between py-10 ltr"
                  inputStyle="selection:bg-accent-700 caret-transparent min-w-[42px] bg-transparent border-t-0 border-l-0 border-r-0 border-b-[2px] border-b-slate-600 dark:border-b-slate-200"
                  focusStyle="!border-b-accent-700"
                  isInputNum
                  shouldAutoFocus
                  errorStyle={{
                    borderBottom: "2px solid",
                    borderBottomColor: theme.palette.error.main,
                  }}
                  hasErrored={
                    errors.verificationCode && touched.verificationCode
                  }
                />
                <Typography variant="caption" color="error.main">
                  {errors.verificationCode && touched.verificationCode
                    ? errors.verificationCode
                    : " "}
                </Typography>
                {open && (
                  <CountDownTimer
                    startDate={new Date(tokenCreateDate).getTime()}
                    handleResendVerificationCode={handleResendOtp}
                  />
                )}
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
                      setVerificationCode("");
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
                    فعال سازی
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

export default SignupVerificationModal;
