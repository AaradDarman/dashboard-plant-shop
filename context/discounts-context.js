import { createContext } from "react";

export const discountsContext = createContext({
  discountTitle: "",
  setDiscountTitle: () => {},
  discountPercentage: "",
  setDiscountPercentage: () => {},
  discountDateRange: [],
  setDiscountDateRange: () => {},
  openSelectProductsModal: () => {},
  productsWithoutDiscount: [],
  selectedForDiscount: [],
  setSelectedForDiscount: () => {},
  handleRemoveSelectedProduct: () => {},
  handleSaveDiscount: () => {},
  openExpireDiscountModal: () => {},
  openRemoveProductDiscountModal: () => {},
});
