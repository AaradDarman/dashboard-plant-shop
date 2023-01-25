import { createContext } from "react";

export const productContext = createContext({
  name: "",
  setName: () => {},
  description: "",
  setDescription: () => {},
  sizes: [],
  setSizes: () => {},
  category: [],
  setCategory: () => {},
  care: {},
  setCare: () => {},
  light: "",
  setLight: () => {},
  watering: "",
  setWatering: () => {},
  images: [],
  setImages: () => {},
  inventory: [],
  setInventory: () => {},
  handleCreateProduct: () => {},
});
