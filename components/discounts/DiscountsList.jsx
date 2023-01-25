import { faEllipsisVertical, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  alpha,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import Icon from "components/shared/Icon";
import { discountsContext } from "context/discounts-context";
import Link from "next/link";
import React, { useContext, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { expireDiscount, getDiscounts } from "redux/slices/discounts";
import { getPersianDate } from "utils/date-helper";

const statusColors = {
  "coming-soon": "bg-[#ffffff]/[.12]",
  active: "bg-[#16a34a]/20",
  expired: "bg-[#db3131]/30",
};

const DiscountsList = ({ className }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { openExpireDiscountModal } = useContext(discountsContext);
  const { entity, status } = useSelector((state) => state.discounts);

  useEffect(() => {
    dispatch(getDiscounts());
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, title) => {
    setAnchorEl({ [title]: event.currentTarget });
    // setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={`${className} relative flex flex-wrap items-center`}>
      {status === "loading" ? (
        <PulseLoader
          size={6}
          color={theme.palette.accent.main}
          loading={true}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      ) : (
        entity.map((discount) => (
          <div
            key={discount.title}
            className={`${
              statusColors[discount.status]
            } relative mr-2 flex flex-col rounded-[4px] py-6 px-4`}
          >
            <IconButton
              id={`iconbtn-${discount.title}`}
              aria-controls={
                Boolean(anchorEl && anchorEl[discount.title])
                  ? `menuItem-${discount.title}`
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                Boolean(anchorEl && anchorEl[discount.title])
                  ? "true"
                  : undefined
              }
              onClick={(e) => handleClick(e, discount.title)}
              className="!absolute top-[2px] right-[2px] !text-[19px]"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} width={19} />
            </IconButton>
            <Menu
              id={`menuItem-${discount.title}`}
              MenuListProps={{
                "aria-labelledby": `iconbtn-${discount.title}`,
              }}
              anchorEl={anchorEl && anchorEl[discount.title]}
              open={Boolean(anchorEl && anchorEl[discount.title])}
              keepMounted
              onClose={handleClose}
              elevation={0}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: theme.palette.primary[800],
                },
                "& .MuiMenuItem-root": {
                  "&:active": {
                    backgroundColor: alpha(
                      theme.palette.secondary.main,
                      theme.palette.action.selectedOpacity
                    ),
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  openExpireDiscountModal(discount);
                  handleClose();
                }}
              >
                <Icon icon="remove" size={19} className="ml-[9px]" />
                ابطال تخفیف
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href={`/discounts/${discount.title}`}>
                  <a>
                    <Icon icon="info" size={21} className="ml-[8px]" />
                    <span>جزئیات</span>
                  </a>
                </Link>
              </MenuItem>
            </Menu>
            <div className="my-2">
              <span className="text-gray-400">عنوان تخفیف: </span>
              {discount.title}
            </div>
            <div className="my-2">
              <span className="text-gray-400">تاریخ شروع: </span>
              {getPersianDate(discount.startDate)}
            </div>
            <div className="my-2">
              <span className="text-gray-400">تاریخ پایان: </span>
              {getPersianDate(discount.endDate)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DiscountsList;
