import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  addNewCategory,
  addNewProduct,
  addNewSize,
  deleteProduct,
  editProduct,
} from "redux/slices/products";
import AddNewCategoryModal from "components/modals/AddNewCategoryModal";
import AddNewSizeModal from "components/modals/AddNewSizeModal";
import DeleteProductModal from "components/modals/DeleteProductModal";
import LoadingComponent from "components/shared/LoadingComponent";
import { productContext } from "./product-context";
import { convetStringToUrlFormat } from "utils/string-helper";

const ProductContext = ({ children }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([]);
  const [category, setCategory] = useState([]);
  const [care, setCare] = useState({});
  const [light, setLight] = useState("");
  const [watering, setWatering] = useState("");
  const [images, setImages] = useState([]);
  const [inventory, setInventory] = useState([]);
  const router = useRouter();
  const [isDeletePruductModalOpen, setIsDeletePruductModalOpen] =
    useState(false);
  const [isAddNewCategoryModal, setIsAddNewCategoryModal] = useState(false);
  const [isAddNewSizeModal, setIsAddNewSizeModal] = useState(false);
  const [targetProductForDelete, setTargetProductForDelete] = useState("");
  const { status } = useSelector((state) => state.products);

  const openDeleteProductModal = (productId) => {
    setTargetProductForDelete(productId);
    setIsDeletePruductModalOpen(true);
  };
  const closeDeleteProductModal = () => {
    setIsDeletePruductModalOpen(false);
  };

  const openAddNewCategoryModal = () => {
    setIsAddNewCategoryModal(true);
  };
  const closeAddNewCategoryModal = () => {
    setIsAddNewCategoryModal(false);
  };

  const openAddNewSizeModal = () => {
    setIsAddNewSizeModal(true);
  };
  const closeAddNewSizeModal = () => {
    setIsAddNewSizeModal(false);
  };

  const dispatch = useDispatch();

  const handleCreateProduct = (formData) => {
    dispatch(addNewProduct(formData))
      .unwrap()
      .then((originalPromiseResult) => {
        router.replace("/products");
      });
  };

  const handleEditProduct = (formData) => {
    dispatch(editProduct(formData))
      .unwrap()
      .then((originalPromiseResult) => {
        router.replace("/products");
      });
  };

  const handleDeleteProduct = async () => {
    dispatch(deleteProduct(targetProductForDelete))
      .unwrap()
      .then((originalPromiseResult) => {
        closeDeleteProductModal();
      });
  };

  const handleAddNewCategory = ({ category }) => {
    dispatch(
      addNewCategory({
        name: category,
        slug: convetStringToUrlFormat(category),
      })
    )
      .unwrap()
      .then(() => {
        closeAddNewCategoryModal();
      });
  };

  const handleAddNewSize = (size) => {
    dispatch(addNewSize(size))
      .unwrap()
      .then(() => {
        closeAddNewSizeModal();
      });
  };

  useEffect(() => {
    console.log(status);
  }, [status]);

  return (
    <productContext.Provider
      value={{
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
        handleEditProduct,
        openDeleteProductModal,
        openAddNewCategoryModal,
        openAddNewSizeModal,
      }}
    >
      <DeleteProductModal
        isOpen={isDeletePruductModalOpen}
        onClose={closeDeleteProductModal}
        onDeleteClick={handleDeleteProduct}
      />
      <AddNewCategoryModal
        isOpen={isAddNewCategoryModal}
        onClose={closeAddNewCategoryModal}
        onAddCategory={handleAddNewCategory}
      />
      <AddNewSizeModal
        isOpen={isAddNewSizeModal}
        onClose={closeAddNewSizeModal}
        onAddSize={handleAddNewSize}
      />
      <LoadingComponent
        show={
          status === "editing" ||
          status === "createing" ||
          status === "deleting"
        }
      />
      {children}
    </productContext.Provider>
  );
};

export default ProductContext;
