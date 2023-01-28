import kebabCase from "lodash/kebabCase";

const renameFile = (originalFile, newName) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

/**
 *
 * @param {String} productName - name of product
 * @param {[File]} images - product images
 *
 *
 */
export const extractImages = (productName, images) => {
  let renamedImages = images.map((image, index) =>
  renameFile(image, `${kebabCase(productName)}-${index + 1}.`)
  );
  
  return renamedImages;
};

export const getMinPrice = (inventory) => {
  let prices = inventory.map((obj) => obj.price);
  return Math.min(...prices);
};

/**
 *
 * @param {Number} orginalPrice - orginalPrice of product
 * @param {Number} discount - product discount in percent
 * @returns {function(): number} discountedPrice
 *
 *
 */
export const calculateDiscountedPrice = (orginalPrice, discount) => {
  return orginalPrice - (orginalPrice * discount) / 100;
};

/**
 *
 * @param {[Object]} discounts - array of product discount object
 * @returns {function(): object} discount object
 *
 *
 */
export const getMaxDiscount = (discounts) => {
  let discountsPercents = discounts.map((obj) => obj.discount);
  if (discounts.length > 1) {
    let max = Math.max(...discountsPercents);
    return discounts.find((obj) => obj.discount === max);
  } else {
    return discounts[0];
  }
};

/**
 *
 * @param {[Object]} cartItems - array of product object
 * @returns {function(): number} discountedTotalPrice in number format
 *
 *
 */
export const calculateDiscountedTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    if (item.discount) {
      return (
        (item.price - (item.price * item.discount) / 100) * item.quantity +
        total
      );
    } else {
      return item.price * item.quantity + total;
    }
  }, 0);
};

/**
 *
 * @param {Number} totalPrice - total price of items without apply discounts
 * @param {Number} totalDiscountedPrice - totalDiscountedPrice
 * @returns {function(): number} totalDiscount in number format
 *
 *
 */
export const calculateTotalDiscount = (totalPrice, totalDiscountedPrice) => {
  return 100 - (totalDiscountedPrice * 100) / totalPrice;
};

export const getDiscountsRange = (discounts) => {
  let discountsPercents = discounts.map((obj) => obj.discount);
  if (discountsPercents.length > 1) {
    let min = Math.min(...discountsPercents);
    let max = Math.max(...discountsPercents);
    return `%${min}-${max}`;
  } else {
    return `%${discountsPercents[0]}`;
  }
};
