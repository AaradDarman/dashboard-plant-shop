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

const AddNewLightModal = ({ isOpen, onClose, onAddLight }) => {
  const theme = useTheme();

  const AddNewLightSchema = Yup.object().shape({
    light: Yup.string()
      .min(3, "دسته بندی وارد شده باید بیشتر از 3 حرف باشد")
      .max(90, "دسته بندی وارد شده نباید بیشتر از 90 حرف باشد")
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
                  افزودن شرایط نور جدید
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Formik
              initialValues={{
                light: "",
              }}
              enableReinitialize={false}
              validationSchema={AddNewLightSchema}
              onSubmit={onAddLight}
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
                  <TextField
                    autoFocus
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
                    className="self-center"
                    label=""
                    size="small"
                    value={values.light}
                    fullWidth
                    onChange={(e) => {
                      setFieldValue("light", e.target.value);
                    }}
                    onBlur={handleBlur("light")}
                    error={errors.light && touched.light}
                    FormHelperTextProps={{ style: { marginBottom: "4px" } }}
                    helperText={
                      errors.light && touched.light ? errors.light : " "
                    }
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

export default AddNewLightModal;
