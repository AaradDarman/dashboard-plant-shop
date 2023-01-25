import { useContext, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import AuthContext from "context/AuthContext";
import { authContext } from "context/auth-context";

const StyledWraper = styled.div`
  height: calc(100vh - 58px);
`;

const Reset = () => {
  const router = useRouter();
  const { tk } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const theme = useTheme();
  const { handleResetPassword } = useContext(authContext);

  const ChangePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .notOneOf([Yup.ref("oldPassword")], "رمز عبور با رمز فعلی یکسان است")
      .label("newPassword")
      .required("پر کردن این فیلد الزامی میباشد")
      .min(8, "رمز عبور باید بیشتر از 8 حرف باشد"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "رمز عبور مطابقت ندارد")
      .required("پر کردن این فیلد الزامی میباشد"),
  });

  return (
    <Formik
      initialValues={{
        newPassword,
        confirmNewPassword,
      }}
      enableReinitialize={false}
      validationSchema={ChangePasswordSchema}
      onSubmit={() => handleResetPassword({ newPassword, tk })}
    >
      {({
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => (
        <StyledWraper className="grid grid-cols-11 content-center justify-center">
          <Head>
            <title>{`فروشگاه اینترنتی ${process.env.NEXT_PUBLIC_SITE_NAME}`}</title>
          </Head>
          <Form
            noValidate
            className="col-span-12 flex flex-col rounded-md border border-gray-500 p-8 md:col-span-5 md:col-start-4 lg:col-span-3 lg:col-start-5"
            onSubmit={handleSubmit}
          >
            <IconButton
              onClick={() => router.back()}
              className="self-start text-[18px]"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </IconButton>
            <Typography variant="h6" marginBottom={2} className="text-center">
              تغییر رمز عبور
            </Typography>
            <Typography marginBottom={2} variant="caption">
              رمز عبور باید حداقل ۸ حرفی باشد
            </Typography>
            <TextField
              required
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
              label="رمز عبور جدید"
              size="small"
              margin="dense"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setFieldValue("newPassword", e.target.value);
              }}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? (
                        <FontAwesomeIcon size="xs" icon={faEye} />
                      ) : (
                        <FontAwesomeIcon size="xs" icon={faEyeSlash} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              //   onBlur={handleBlur("newPassword")}
              error={errors.newPassword && touched.newPassword}
              helperText={
                errors.newPassword && touched.newPassword
                  ? errors.newPassword
                  : " "
              }
              inputProps={{ className: "bg-transparent" }}
            />
            <TextField
              required
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
              label="تکرار رمز عبور جدید"
              size="small"
              margin="dense"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value);
                setFieldValue("confirmNewPassword", e.target.value);
              }}
              type={showConfirmNewPassword ? "text" : "password"}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmNewPassword ? (
                        <FontAwesomeIcon size="xs" icon={faEye} />
                      ) : (
                        <FontAwesomeIcon size="xs" icon={faEyeSlash} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              //   onBlur={handleBlur("confirmNewPassword")}
              error={errors.confirmNewPassword && touched.confirmNewPassword}
              helperText={
                errors.confirmNewPassword && touched.confirmNewPassword
                  ? errors.confirmNewPassword
                  : " "
              }
              inputProps={{ className: "bg-transparent" }}
            />
            <Button
              variant="contained"
              type="submit"
              classes={{
                root: "!z-[1] !bg-accent-500 !hover:bg-accent-800",
              }}
            >
              تغییر رمز
            </Button>
          </Form>
        </StyledWraper>
      )}
    </Formik>
  );
};

Reset.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <AuthContext>{page}</AuthContext>
    </MainLayout>
  );
};

export default Reset;
