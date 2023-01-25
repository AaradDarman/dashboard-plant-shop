import React, { useState, useEffect, useContext, useRef } from "react";

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
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { discountsContext } from "context/discounts-context";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import Image from "next/image";
import { PulseLoader } from "react-spinners";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const SelectProductsForDiscountModal = ({
  isOpen,
  onClose,
  onSelectProducts,
}) => {
  const theme = useTheme();
  const { selectedForDiscount } = useContext(discountsContext);
  const [selected, setSelected] = useState(selectedForDiscount);
  const formikRef = useRef(null);
  const { productsWithoutDiscount, status } = useSelector(
    (state) => state.discounts
  );

  useEffect(() => {
    setSelected(selectedForDiscount);
  }, [isOpen]);

  const SelectProductSchema = Yup.object().shape({
    selected: Yup.array()
      .min(1, "انتخاب حداقل یک مورد الزامی می باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
  });

  const handleClick = (clickedProduct) => {
    const selectedIndex = selected.findIndex(
      (o) => o._id === clickedProduct._id
    );
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, clickedProduct);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    formikRef.current.setFieldValue("selected", newSelected);
  };

  const isSelected = (selectedProduct) =>
    selected.some((product) => product._id === selectedProduct._id);

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
                  افزودن سایز جدید
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Formik
              initialValues={{
                selected,
              }}
              enableReinitialize={false}
              validationSchema={SelectProductSchema}
              onSubmit={(values) => {
                onSelectProducts(values);
                setSelected([]);
              }}
              innerRef={formikRef}
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
                  <div className="relative h-[400px] overflow-y-scroll">
                    {status === "fetching" ? (
                      <PulseLoader
                        size={6}
                        color={theme.palette.accent.main}
                        loading={true}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    ) : (
                      productsWithoutDiscount?.map((product, index) => {
                        const isItemSelected = isSelected(product);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <div
                            key={`${product.name}-${product.size}`}
                            className="flex cursor-pointer items-center"
                            onClick={() => handleClick(product)}
                          >
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                              sx={{
                                "&.Mui-checked": {
                                  color: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "accent.main"
                                      : "accent.600",
                                },
                              }}
                            />
                            <Image
                              src={product.images[0]}
                              alt="product-pic"
                              width={50}
                              height={50}
                            />
                            <span className="ml-2">{product.name}</span>
                            <span className="ml-2">{product.size}</span>
                            <span>{product.quantity}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <FormHelperText
                    error={errors.selected && touched.selected}
                    id="inventory-error"
                  >
                    {errors.selected && touched.selected
                      ? errors.selected
                      : " "}
                  </FormHelperText>
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
                      تایید
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

export default SelectProductsForDiscountModal;
