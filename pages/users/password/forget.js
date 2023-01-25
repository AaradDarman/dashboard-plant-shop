import { useContext, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import dynamic from "next/dynamic";

import MainLayout from "components/layouts/MainLayout";
const ConfirmOtp = dynamic(() => import("components/user/forget-password/ConfirmOtp"));

import { authContext } from "context/auth-context";
import AuthContext from "context/AuthContext";

const StyledWraper = styled.div`
  height: calc(100vh - 58px);
`;

const Forget = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const {
    handleCheckUser,
    handleVerifyUser,
    otpSentDate,
    forgotPassPageState,
    setForgotPassPageState,
  } = useContext(authContext);

  const theme = useTheme();

  const validateEmail = (email) => {
    return Yup.string().email().isValidSync(email);
  };

  const validatePhone = (phone) => {
    return Yup.string()
      .matches(/^\d+$/, "فرمت شماره همراه صحیح نمی باشد")
      .test("len", (val) => val && val.toString().length === 11)
      .test("with zero", (val) => val && val.toString().startsWith("0"))
      .isValidSync(phone);
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .test("email_or_phone", "ایمیل / شماره معتبر نمی باشد", (value) => {
        return validateEmail(value) || validatePhone(value ?? "0");
      }),
  });

  return (
    <StyledWraper className="grid content-center justify-center">
      <Head>
        <title>{`فروشگاه اینترنتی ${process.env.NEXT_PUBLIC_SITE_NAME}`}</title>
      </Head>
      <div className="flex flex-col rounded-md border border-gray-500 p-4 sm:p-8">
        <IconButton
          onClick={() => {
            if (forgotPassPageState === "otp") {
              setForgotPassPageState("");
            } else {
              router.back();
            }
          }}
          className="self-start text-[18px]"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </IconButton>
        {forgotPassPageState === "otp" ? (
          <ConfirmOtp
            onConfirm={handleVerifyUser}
            otpSentDate={otpSentDate}
            onResendOtp={() => handleCheckUser({ username })}
          />
        ) : (
          <Formik
            // innerRef={formikRef}
            initialValues={{
              username,
            }}
            enableReinitialize={false}
            validationSchema={LoginSchema}
            onSubmit={handleCheckUser}
          >
            {({
              values,
              handleBlur,
              errors,
              touched,
              setFieldValue,
              handleSubmit,
            }) => (
              <Form className="flex flex-col" onSubmit={handleSubmit}>
                <Typography
                  variant="h6"
                  marginBottom={2}
                  className="text-center"
                >
                  تغییر رمز عبور
                </Typography>
                <Typography marginBottom={2} variant="caption">
                  برای تغییر رمز عبور، شماره موبایل یا ایمیل خود را وارد کنید
                </Typography>
                <TextField
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color:
                        theme.palette.mode === "dark"
                          ? "accent.main"
                          : "accent.600",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "accent.main"
                            : "accent.600",
                      },
                    },
                  }}
                  label="ایمیل یا شماره موبایل"
                  size="small"
                  margin="dense"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFieldValue("username", e.target.value);
                  }}
                  placeholder="09xxxxxxxxx"
                  onBlur={handleBlur("username")}
                  error={errors.username && touched.username}
                  helperText={
                    errors.username && touched.username ? errors.username : " "
                  }
                  inputProps={{ className: "bg-transparent" }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  className="!z-[1] !bg-accent-700 !text-white hover:!bg-accent-800"
                  sx={{ letterSpacing: "2px" }}
                >
                  تایید
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </StyledWraper>
  );
};

Forget.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <AuthContext>{page}</AuthContext>
    </MainLayout>
  );
};

export default Forget;
