import React from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, useTheme } from "@mui/material";
import OtpInput from "react-otp-input";

import CountDownTimer from "components/CountDownTimer";

const ConfirmOtp = ({ onConfirm, otpSentDate, onResendOtp }) => {
  const OtpSchema = Yup.object().shape({
    otp: Yup.string()
      .min(6, "کد وارد شده باید 6 رقم باشد")
      .max(6, "کد وارد شده باید 6 رقم باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
  });

  const theme = useTheme();

  return (
    <Formik
      initialValues={{
        otp: "",
      }}
      enableReinitialize={false}
      validationSchema={OtpSchema}
      onSubmit={onConfirm}
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
          <Form className="flex flex-col" onSubmit={handleSubmit}>
            <Typography variant="h6" marginBottom={2} className="text-center">
              کد تایید را وارد کنید
            </Typography>
            <Typography marginBottom={2} variant="caption">
              کد تایید برای شماره ۰۹۰۳۲۴۱۶۲۹۹ ارسال گردید
            </Typography>
            <OtpInput
              value={values.otp}
              onChange={(val) => {
                // setOtp(val);
                setFieldValue("otp", val);
              }}
              numInputs={6}
              separator={<span className="w-1"></span>}
              containerStyle="flex justify-between py-5 ltr"
              inputStyle="selection:bg-accent-700 caret-transparent min-w-[42px] bg-transparent border-t-0 border-l-0 border-r-0 border-b-[2px] border-b-slate-600 dark:border-b-slate-200"
              focusStyle="!border-b-accent-700"
              isInputNum
              shouldAutoFocus
              errorStyle={{
                borderBottom: "2px solid",
                borderBottomColor: theme.palette.error.main,
              }}
              hasErrored={errors.otp && touched.otp}
            />
            <CountDownTimer
              startDate={otpSentDate}
              handleResendVerificationCode={onResendOtp}
            />
            <Button
              variant="contained"
              type="submit"
              className="!z-[1] !mt-2 !bg-accent-700 !text-white hover:!bg-accent-800"
              sx={{ letterSpacing: "2px" }}
            >
              ادامه
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default ConfirmOtp;
