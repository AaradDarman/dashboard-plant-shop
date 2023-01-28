import React, { useContext, useEffect, useRef, useState } from "react";

import Head from "next/head";

import MainLayout from "components/layouts/MainLayout";
import Cookies from "cookies";
import DiscountsContext from "context/DiscountsContext";
import {
  Button,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import persianCalendar from "react-date-object/calendars/jalali";
import persian_fa from "react-date-object/locales/persian_fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import { discountsContext } from "context/discounts-context";
import Image from "next/image";
import SelectedProductsTable from "components/discounts/SelectedProductsTable";
import DateInput from "components/discounts/DateInput";
import { useDispatch } from "react-redux";
import { getDiscounts } from "redux/slices/discounts";
import DiscountsList from "components/discounts/DiscountsList";

const Discounts = () => {
  const formikRef = useRef(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {
    openSelectProductsModal,
    discountTitle,
    setDiscountTitle,
    discountPercentage,
    setDiscountPercentage,
    discountDateRange,
    setDiscountDateRange,
    selectedForDiscount,
    setSelectedForDiscount,
    handleRemoveSelectedProduct,
    handleSaveDiscount,
  } = useContext(discountsContext);

  const handleClearDate = () => {
    setDiscountDateRange([]);
  };

  const discountSchema = Yup.object().shape({
    discountTitle: Yup.string()
      .min(3, "عنوان وارد شده باید بیشتر از 3 حرف باشد")
      .max(90, "عنوان وارد شده نباید بیشتر از 90 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    discountPercentage: Yup.string()
      .test(
        "Is positive?",
        "عدد وارد شده باید بزرگتر از 0 باشد",
        (value) => +value > 0
      )
      .test(
        "Is Less Than 100?",
        "عدد وارد شده باید کوچکتر از 100 باشد",
        (value) => +value < 100
      )
      .required("پر کردن این فیلد الزامی می باشد"),
    discountDateRange: Yup.array().required("پر کردن این فیلد الزامی می باشد"),
    selectedForDiscount: Yup.array()
      .min(1, "انتخاب حداقل یک محصول الزامی می باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
  });

  useEffect(() => {
    formikRef.current.setFieldValue("selectedForDiscount", selectedForDiscount);
  }, [selectedForDiscount]);

  return (
    <div className="flex min-h-[calc(100vh_-_34px)] flex-col">
      <Formik
        innerRef={formikRef}
        initialValues={{
          discountTitle,
          discountPercentage,
          discountDateRange,
          selectedForDiscount,
        }}
        enableReinitialize={false}
        validationSchema={discountSchema}
        onSubmit={handleSaveDiscount}
      >
        {({
          values,
          handleBlur,
          errors,
          touched,
          setFieldValue,
          handleSubmit,
        }) => (
          <div className="flex flex-wrap">
            <Head>
              <title>تخفیفات</title>
            </Head>
            <div className="flex flex-col items-start p-4">
              <TextField
                variant="outlined"
                label="عنوان تخفیف"
                size="small"
                margin="dense"
                required
                autoComplete="off"
                value={discountTitle}
                onChange={(e) => {
                  setDiscountTitle(e.target.value);
                  setFieldValue("discountTitle", e.target.value);
                }}
                onBlur={handleBlur("discountTitle")}
                error={errors.discountTitle && touched.discountTitle}
                helperText={
                  errors.discountTitle && touched.discountTitle
                    ? errors.discountTitle
                    : " "
                }
                sx={{
                  marginBottom: "1rem",
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
              <TextField
                variant="outlined"
                label="درصد تخفیف"
                size="small"
                margin="dense"
                required
                autoComplete="off"
                value={discountPercentage}
                onChange={(e) => {
                  setDiscountPercentage(e.target.value);
                  setFieldValue("discountPercentage", e.target.value);
                }}
                onBlur={handleBlur("discountPercentage")}
                error={errors.discountPercentage && touched.discountPercentage}
                helperText={
                  errors.discountPercentage && touched.discountPercentage
                    ? errors.discountPercentage
                    : " "
                }
                sx={{
                  marginBottom: "1rem",
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
              <DatePicker
                calendar={persianCalendar}
                locale={persian_fa}
                className="bg-dark green"
                range
                rangeHover
                render={
                  <DateInput
                    clearDate={handleClearDate}
                    stringDate={
                      discountDateRange.length
                        ? discountDateRange
                            .map((d) =>
                              d.convert(persianCalendar, persian_fa).format()
                            )
                            .join(" - ")
                        : ""
                    }
                    isDatePickerOpen={isDatePickerOpen}
                  />
                }
                value={discountDateRange}
                onChange={(val) => {
                  setDiscountDateRange(val);
                  setFieldValue("discountDateRange", val);
                }}
                onBlur={handleBlur("discountDateRange")}
                error={errors.discountDateRange && touched.discountDateRange}
                helperText={
                  errors.discountDateRange && touched.discountDateRange
                    ? errors.discountDateRange
                    : " "
                }
                minDate={new DateObject({ calendar: persianCalendar })}
                onOpen={() => setIsDatePickerOpen(true)}
                onClose={() => setIsDatePickerOpen(false)}
              />
              <Button
                onClick={openSelectProductsModal}
                variant="contained"
                className=" !mt-2 !bg-primary-700 !text-white hover:!bg-primary-800"
                size="small"
              >
                انتخاب محصول
                <FontAwesomeIcon icon={faAdd} width={15} />
              </Button>
              <FormHelperText
                error={
                  errors.selectedForDiscount && touched.selectedForDiscount
                }
                id="inventory-error"
              >
                {errors.selectedForDiscount && touched.selectedForDiscount
                  ? errors.selectedForDiscount
                  : " "}
              </FormHelperText>
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="!mt-auto !bg-accent-700 !text-white hover:!bg-accent-800"
                size="small"
              >
                ذخیره
              </Button>
            </div>
            <div className="h-[400px] flex-1 py-4 px-[4px] md:p-4">
              <SelectedProductsTable
                items={selectedForDiscount}
                onRemoveItem={handleRemoveSelectedProduct}
              />
            </div>
          </div>
        )}
      </Formik>
      <Divider variant="middle" />
      <DiscountsList className="flex-1" />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (!authorization) {
    return {
      redirect: {
        destination: `/users/login?returnUrl=${ctx.resolvedUrl}&forceLogout=true`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

Discounts.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <DiscountsContext>{page}</DiscountsContext>
    </MainLayout>
  );
};

export default Discounts;
