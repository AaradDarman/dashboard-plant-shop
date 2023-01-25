import React, { useContext, useState, useEffect } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Chip, IconButton, useTheme } from "@mui/material";

import { numberWithCommas } from "utils/number-helper";
import { productContext } from "context/product-context";
import {
  calculateDiscountedPrice,
  getDiscountsRange,
  getMaxDiscount,
} from "utils/product-helper";
import { shorten } from "utils/string-helper";
import Icon from "./shared/Icon";
import dayjs from "dayjs";
import { isDiscountArrive } from "utils/date-helper";

const Product = ({
  name,
  description,
  inventory,
  sizes,
  images,
  _id,
  className,
  discount,
}) => {
  const [maxDiscount, setMaxDiscount] = useState({});
  const [maxPrice, setMaxPrice] = useState(0);
  const [hasStock, setHasStock] = useState(true);
  const [hasDiscount, setHasDiscount] = useState(false);
  const theme = useTheme();
  const { openDeleteProductModal } = useContext(productContext);

  useEffect(() => {
    let pStock = getProductStock();
    setHasStock(pStock.some((stock) => stock > 0));
    if (discount) {
      setMaxDiscount(getMaxDiscount(discount.includes));
      setMaxPrice(
        inventory?.find(
          (stock) => stock.size === getMaxDiscount(discount.includes).size
        )?.price
      );
    }
    setHasDiscount(isDiscountArrive(discount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductStock = () => {
    return inventory.map((stock) => stock.quantity);
  };

  const handleDelete = () => {
    openDeleteProductModal(_id);
  };

  return (
    <article
      className={`product relative flex min-h-[300px] flex-col md:h-[270px] ${className} rounded-2xl bg-secondary-light p-4 dark:bg-secondary-dark-800 sm:p-8`}
    >
      <div className="flex flex-1 flex-col hover:text-inherit">
        <div className="absolute left-0 -top-[85px] md:-left-12">
          <Image
            src={images[0]}
            alt="plant"
            width={250}
            height={250}
            className={`drop-shadow-2x ${!hasStock && "grayscale"}`}
          />
        </div>
        <div className="mt-40 flex flex-col md:ml-28 md:mt-0">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="py-1 text-gray-400">{shorten(description, 80)}</p>
        </div>
        {hasStock ? (
          <div className="my-[15px] mt-auto flex justify-between font-bold">
            {hasDiscount && (
              <Chip
                label={`${
                  hasDiscount && getMaxDiscount(discount?.includes).discount
                }%`}
                color="error"
                size="small"
              />
            )}
            <div className="flex flex-col">
              <span>{`${
                hasDiscount
                  ? numberWithCommas(
                      calculateDiscountedPrice(maxPrice, maxDiscount.discount)
                    )
                  : numberWithCommas(
                      inventory?.find((stock) => stock.size === sizes[0].label)
                        .price
                    )
              } تومان`}</span>
              {hasDiscount && (
                <span className="text-[14px] text-gray-400 line-through">
                  {numberWithCommas(maxPrice)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="my-[15px] mt-auto flex justify-center font-bold">
            <span>نا موجود</span>
          </div>
        )}
        <div className="flex">
          <IconButton onClick={handleDelete}>
            <Icon icon="delete" size={22} color={theme.palette.error.main} />
          </IconButton>
          <Link href={`/products/edit/${_id}`} passHref>
            <a className="hover:text-inherit">
              <IconButton>
                <Icon icon="edit" size={22} />
              </IconButton>
            </a>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Product;
