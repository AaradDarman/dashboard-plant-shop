import React, { forwardRef } from "react";
import { getPersianDate } from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";

const OrdersToPrint = forwardRef((props, ref) => {
  const { orders } = props;
  return (
    <div style={{ display: "none" }}>
      <div
        style={{ direction: "rtl" }}
        className="relative grid flex-1 grid-cols-2 gap-2 p-2"
        ref={ref}
      >
        {orders?.map((order) => (
          <div
            key={order._id}
            className="flex break-inside-avoid flex-col border-[1px] border-solid border-black p-4 "
          >
            <span>
              آدرس پستی:{" "}
              {`${order.address.postalAddress} - پلاک ${order.address.plaque}`}
            </span>
            <span>کد پستی: {order.address.postalCode}</span>
            <span>
              دریافت کننده:{" "}
              {`${order.address.receiver.fName} ${order.address.receiver.lName}`}
            </span>
            <span>شماره سفارش: {order.orderNumber}</span>
            <span>
              مبلغ کل: {`${numberWithCommas(order.totalPrice)} تومان`}
            </span>
            <span>تاریخ سفارش: {getPersianDate(order.createAt)}</span>
            <div className="flex flex-wrap">
              <span className="ml-2">آیتم ها: </span>
              {order.items.map((item) => (
                <span
                  key={item._id}
                >{`${item.name} ${item.size} (${item.quantity} عدد)`}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

OrdersToPrint.displayName = "OrdersToPrint";

export default OrdersToPrint;
