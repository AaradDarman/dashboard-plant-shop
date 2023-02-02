import React, { useContext, useEffect, useRef } from "react";

import Head from "next/head";
import { useSelector } from "react-redux";
import { Button, Divider, FormHelperText, TextField } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import MainLayout from "components/layouts/MainLayout";
import ImageSelector from "components/Products/ImageSelector";
import ProductContext from "context/ProductContext";
import { productContext } from "context/product-context";
import CategorySelector from "components/Products/CategorySelector";
import SizeSelector from "components/Products/SizeSelector";
import StockInput from "components/Products/StockInput";
import PotSizes from "components/Products/PotSizes";
import Cookies from "cookies";
import { extractImages } from "utils/product-helper";
import LightSelector from "components/Products/LightSelector";

const Create = () => {
  const formikRef = useRef(null);
  const {
    categories,
    sizes: reduxSizes,
    lights,
  } = useSelector((state) => state.products);
  const {
    name,
    setName,
    description,
    setDescription,
    sizes,
    setSizes,
    category,
    setCategory,
    care,
    setCare,
    light,
    setLight,
    watering,
    setWatering,
    images,
    setImages,
    inventory,
    setInventory,
    handleCreateProduct,
  } = useContext(productContext);

  useEffect(() => {
    setInventory(
      sizes.map((size) => {
        return { size: JSON.parse(size).label, quantity: "", price: "" };
      })
    );
    formikRef.current.setFieldValue(
      "inventory",
      sizes.map((size) => {
        return { size: JSON.parse(size).label, quantity: "", price: "" };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes]);

  const AddProductSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "عنوان وارد شده باید بیشتر از 3 حرف باشد")
      .max(90, "عنوان وارد شده نباید بیشتر از 90 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    description: Yup.string()
      .min(3, "توضیحات وارد شده باید بیشتر از 3 حرف باشد")
      .max(900, "توضیحات وارد شده نباید بیشتر از 900 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    category: Yup.array()
      .min(1, "وارد کردن حداقل یک دسته بندی الزامی می باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    sizes: Yup.array()
      .min(1, "وارد کردن حداقل یک سایز الزامی می باشد")
      .test("Sizes", "لطفا فرم را با دقت پر کنید", (value) => {
        return (
          !_.isEmpty(value) &&
          value.length ===
            value.map((obj) => JSON.parse(obj).diameter).filter(Number)
              .length &&
          value.length ===
            value.map((obj) => JSON.parse(obj).height).filter(Number).length
        );
      }),
    images: Yup.array()
      .min(1, "انتخاب حداقل یک تصویر برای محصول الزامی است")
      .required("پر کردن این فیلد الزامی می باشد"),
    inventory: Yup.array().test(
      "Inventory",
      "لطفا فرم را با دقت پر کنید",
      (value) => {
        return (
          !_.isEmpty(value) &&
          value.length ===
            value.map((obj) => obj.quantity).filter(Number).length &&
          value.length === value.map((obj) => obj.price).filter(Number).length
        );
      }
    ),
    light: Yup.string().required("پر کردن این فیلد الزامی می باشد"),
    watering: Yup.string()
      .min(3, "شرایط آبیاری وارد شده باید بیشتر از 3 حرف باشد")
      .max(90, "شرایط آبیاری وارد شده نباید بیشتر از 90 حرف باشد"),
    lightCare: Yup.string()
      .min(3, "شرایط نوری و هوای وارد شده باید بیشتر از 3 حرف باشد")
      .max(900, "شرایط نوری و هوای وارد شده نباید بیشتر از 900 حرف باشد"),
    wateringCare: Yup.string()
      .min(3, "شرایط آبیاری و خاک وارد شده باید بیشتر از 3 حرف باشد")
      .max(900, "شرایط آبیاری و خاک وارد شده نباید بیشتر از 900 حرف باشد"),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        name,
        description,
        category,
        sizes,
        images,
        inventory,
        light,
        watering,
        lightCare: care.light,
        wateringCare: care.watering,
      }}
      enableReinitialize={false}
      validationSchema={AddProductSchema}
      onSubmit={async (values) => {
        let formData = new FormData();
        let images = await extractImages(values.name, values.images);
        for (let i = 0; i < images.length; i++) {
          formData.append(images[i].name, images[i]);
        }
        formData.append(
          "product",
          JSON.stringify({
            name: values.name,
            description: values.description,
            sizes: values.sizes.map((obj) => JSON.parse(obj)),
            category: values.category,
            care: { light: values.lightCare, watering: values.wateringCare },
            light: values.light,
            watering: values.watering,
            inventory: values.inventory,
          })
        );
        handleCreateProduct(formData);
      }}
    >
      {({
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => {
        return (
          <>
            <Head>
              <title>محصولات | افزودن محصول</title>
            </Head>
            <div className="flex flex-col p-4 lg:flex-row">
              <ImageSelector
                images={images}
                onChange={(images) => {
                  setImages(images);
                  setFieldValue("images", images);
                }}
                error={errors.images && touched.images}
                helperText={
                  errors.images && touched.images ? errors.images : " "
                }
                className="self-center lg:self-auto"
              />
              <div className="flex flex-1 flex-col lg:pr-[1rem]">
                <TextField
                  variant="outlined"
                  label="نام محصول"
                  size="small"
                  margin="dense"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldValue("name", e.target.value);
                  }}
                  onBlur={handleBlur("name")}
                  error={errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : " "}
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
                <TextField
                  variant="outlined"
                  label="توضیحات"
                  size="small"
                  margin="dense"
                  required
                  multiline
                  minRows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFieldValue("description", e.target.value);
                  }}
                  onBlur={handleBlur("description")}
                  error={errors.description && touched.description}
                  helperText={
                    errors.description && touched.description
                      ? errors.description
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
                <CategorySelector
                  categories={categories}
                  values={category}
                  onChange={(v) => {
                    setCategory(v);
                    setFieldValue("category", v);
                  }}
                  onBlur={handleBlur("category")}
                  error={errors.category && touched.category}
                  helperText={
                    errors.category && touched.category ? errors.category : " "
                  }
                />
              </div>
            </div>
            <div className="flex flex-col p-4">
              <Divider
                variant="middle"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.23)",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
                textAlign="left"
              >
                سایز
              </Divider>
              <SizeSelector
                className="lg:!mr-[262px]"
                sizes={reduxSizes.map((size) => ({
                  label: size,
                  diameter: "",
                  height: "",
                }))}
                values={sizes}
                onChange={(v) => {
                  setSizes(v);
                  setFieldValue("sizes", v);
                }}
                onBlur={handleBlur("sizes")}
                error={errors.sizes && touched.sizes}
                // helperText={errors.sizes && touched.sizes ? errors.sizes : " "}
              />
              {sizes.length ? (
                <>
                  <PotSizes
                    className="lg:mr-[262px]"
                    sizes={sizes}
                    inventory={inventory}
                    onChange={(values) => {
                      setSizes(values);
                      setFieldValue("sizes", values);
                    }}
                    error={errors.sizes && touched.sizes}
                    // helperText={
                    //   errors.inventory && touched.inventory
                    //     ? errors.inventory
                    //     : " "
                    // }
                  />
                </>
              ) : null}
              <FormHelperText
                error={errors.sizes && touched.sizes}
                id="images-error"
                className="!ml-[14px] !mr-[14px] lg:!mr-[276px]"
              >
                {errors.sizes && touched.sizes ? errors.sizes : " "}
              </FormHelperText>
              <Divider
                variant="middle"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.23)",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
                textAlign="left"
              >
                موجودی و قیمت
              </Divider>
              {sizes.length ? (
                <>
                  <StockInput
                    className="lg:mr-[262px]"
                    sizes={sizes}
                    inventory={inventory}
                    onChange={(values) => {
                      setInventory(values);
                      setFieldValue("inventory", values);
                    }}
                    error={errors.inventory && touched.inventory}
                    helperText={
                      errors.inventory && touched.inventory
                        ? errors.inventory
                        : " "
                    }
                  />
                </>
              ) : null}
            </div>
            <div className="flex flex-col p-4">
              <Divider
                variant="middle"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.23)",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
                textAlign="left"
              >
                شرایط نگه داری
              </Divider>
              <LightSelector
                lights={lights}
                value={light}
                className="lg:!mr-[262px]"
                onChange={(v) => {
                  setLight(v);
                  setFieldValue("light", v);
                }}
                onBlur={handleBlur("light")}
                error={errors.light && touched.light}
                helperText={errors.light && touched.light ? errors.light : " "}
              />
              <TextField
                variant="outlined"
                label="آبیاری"
                size="small"
                margin="dense"
                value={watering}
                onChange={(e) => {
                  setWatering(e.target.value);
                  setFieldValue("watering", e.target.value);
                }}
                onBlur={handleBlur("watering")}
                error={errors.watering && touched.watering}
                helperText={
                  errors.watering && touched.watering ? errors.watering : " "
                }
                className="lg:!mr-[262px]"
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
              <TextField
                variant="outlined"
                label="شرایط نوری و هوا"
                size="small"
                margin="dense"
                multiline
                minRows={5}
                value={care.light}
                onChange={(e) => {
                  setCare({ ...care, light: e.target.value });
                  setFieldValue("lightCare", e.target.value);
                }}
                onBlur={handleBlur("lightCare")}
                error={errors.lightCare && touched.lightCare}
                helperText={
                  errors.lightCare && touched.lightCare ? errors.lightCare : " "
                }
                className="lg:!mr-[262px]"
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
              <TextField
                variant="outlined"
                label="شرایط آبیاری و خاک"
                size="small"
                margin="dense"
                multiline
                minRows={5}
                value={care.watering}
                onChange={(e) => {
                  setCare({ ...care, watering: e.target.value });
                  setFieldValue("wateringCare", e.target.value);
                }}
                onBlur={handleBlur("wateringCare")}
                error={errors.wateringCare && touched.wateringCare}
                helperText={
                  errors.wateringCare && touched.wateringCare
                    ? errors.wateringCare
                    : " "
                }
                className="lg:!mr-[262px]"
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
              <Button
                variant="contained"
                onClick={handleSubmit}
                classes={{
                  root: "!bg-accent-700 !self-center hover:!bg-accent-800 !text-white !mt-auto !hidden md:!block !text-center",
                }}
                sx={{ letterSpacing: "2px", alignSelf: "center" }}
              >
                ذخیره محصول
              </Button>
            </div>
          </>
        );
      }}
    </Formik>
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

Create.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <ProductContext>{page}</ProductContext>
    </MainLayout>
  );
};

export default Create;
