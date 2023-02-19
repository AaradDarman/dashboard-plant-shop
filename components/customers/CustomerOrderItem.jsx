import React from "react";

import Image from "next/image";

import { Badge } from "@mui/material";

const CustomerOrderItem = ({ item }) => {
  return (
    <div className="relative flex items-stretch p-[0.8rem]">
      {item?.images && (
        <div className="relative flex">
          <Badge
            overlap="rectangular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={item.quantity}
            color="info"
            sx={{
              "& .MuiBadge-badge": {
                borderRadius: "4px",
              },
            }}
          >
            <div className="flex flex-col items-center text-[13px]">
              <Image
                src={item.images[0]}
                alt="product-image"
                width={60}
                height={60}
              />
              <span>{item.size}</span>
            </div>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderItem;
