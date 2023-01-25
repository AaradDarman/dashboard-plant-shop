import React, { useContext } from "react";

import { Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import AuthContext from "context/AuthContext";
import { authContext } from "context/auth-context";
import Cookies from "cookies";

const Signup = () => {
  const {
    fName,
    setFName,
    lName,
    setLName,
    email,
    setEmail,
    personalCode,
    setPersonalCode,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    handleSignup,
  } = useContext(authContext);
  const theme = useTheme();

  const SignupSchema = Yup.object().shape({
    fName: Yup.string()
      .min(3, "نام وارد شده باید بیشتر از 3 حرف باشد")
      .max(50, "نام وارد شده نباید بیشتر از 50 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد")
      .test("alphabets", "نام وارد شده نباید حاوی اعداد باشد", (value) => {
        return !/\d/g.test(value);
      }),
    lName: Yup.string()
      .min(3, "نام وارد شده باید بیشتر از 3 حرف باشد")
      .max(50, "نام وارد شده نباید بیشتر از 50 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد")
      .test("alphabets", "نام وارد شده نباید حاوی اعداد باشد", (value) => {
        return !/\d/g.test(value);
      }),
    email: Yup.string()
      .email("فرمت وارد شده صحیح نمی باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    personalCode: Yup.number()
      .required("پر کردن این فیلد الزامی می باشد")
      .typeError("ارقام وارد کنید")
      .test(
        "len",
        "کد ملی باید 10 رقم باشد",
        (val) => val && val.toString().length === 10
      ),
    phoneNumber: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .matches(/^\d+$/, "فرمت شماره همراه صحیح نمی باشد")
      .test(
        "len",
        "شماره همراه باید 11 رقم باشد",
        (val) => val && val.toString().length === 11
      )
      .test(
        "with zero",
        "شماره همراه باید با صفر شروع شود",
        (val) => val && val.toString().startsWith("0")
      ),
    password: Yup.string()
      .label("Password")
      .required("پر کردن این فیلد الزامی می باشد")
      .min(8, "رمز عبور باید بیشتر از 8 حرف باشد"),
  });

  return (
    <Formik
      initialValues={{
        fName,
        lName,
        email,
        personalCode,
        phoneNumber,
        password,
      }}
      enableReinitialize={false}
      validationSchema={SignupSchema}
      onSubmit={handleSignup}
    >
      {({
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => (
        <div className="grid grid-cols-11 content-center justify-center bg-white dark:bg-primary-900">
          <Head>
            <title>{`فروشگاه اینترنتی ${process.env.NEXT_PUBLIC_SITE_NAME}`}</title>
          </Head>
          <Form
            className="col-span-12 flex flex-col rounded-md border border-gray-500 py-4 px-8 md:col-span-5 md:col-start-4 lg:col-span-3 lg:col-start-5"
            onSubmit={handleSubmit}
          >
            <Typography variant="h5" marginBottom={2} className="text-center">
              ثبت نام
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
              label="نام"
              size="small"
              value={fName}
              onChange={(e) => {
                setFName(e.target.value);
                setFieldValue("fName", e.target.value);
              }}
              onBlur={handleBlur("fName")}
              error={errors.fName && touched.fName}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={errors.fName && touched.fName ? errors.fName : " "}
            />
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
              label="نام خانوادگی"
              size="small"
              value={lName}
              onChange={(e) => {
                setLName(e.target.value);
                setFieldValue("lName", e.target.value);
              }}
              onBlur={handleBlur("lName")}
              error={errors.lName && touched.lName}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={errors.lName && touched.lName ? errors.lName : " "}
            />
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
              label="ایمیل"
              size="small"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldValue("email", e.target.value);
              }}
              onBlur={handleBlur("email")}
              error={errors.email && touched.email}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={errors.email && touched.email ? errors.email : " "}
            />
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
              label="کد ملی"
              size="small"
              value={personalCode}
              onChange={(e) => {
                setPersonalCode(e.target.value);
                setFieldValue("personalCode", e.target.value);
              }}
              onBlur={handleBlur("personalCode")}
              error={errors.personalCode && touched.personalCode}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={
                errors.personalCode && touched.personalCode
                  ? errors.personalCode
                  : " "
              }
            />
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
              label="شماره همراه"
              size="small"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setFieldValue("phoneNumber", e.target.value);
              }}
              onBlur={handleBlur("phoneNumber")}
              error={errors.phoneNumber && touched.phoneNumber}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={
                errors.phoneNumber && touched.phoneNumber
                  ? errors.phoneNumber
                  : " "
              }
            />
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
              label="رمز عبور"
              size="small"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldValue("password", e.target.value);
              }}
              type="password"
              autoComplete="current-password"
              onBlur={handleBlur("password")}
              error={errors.password && touched.password}
              FormHelperTextProps={{ style: { marginBottom: "4px" } }}
              helperText={
                errors.password && touched.password ? errors.password : " "
              }
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="!mt-4 !bg-accent-700 !text-white hover:!bg-accent-800"
              sx={{ letterSpacing: "1px" }}
            >
              ثبت نام
            </Button>
            <Typography variant="body2" className="!mt-3 !mb-2">
              قبلا ثبت نام کردی؟
              <Link href={"/users/login"}>
                <a className="hover:text-accent-700">{` ورود`}</a>
              </Link>
            </Typography>
          </Form>
        </div>
      )}
    </Formik>
  );
};


export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (authorization) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

Signup.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <AuthContext>{page}</AuthContext>
    </MainLayout>
  );
};

export default Signup;
