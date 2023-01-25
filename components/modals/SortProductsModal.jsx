import React from "react";

import { Backdrop, Box, MenuItem, Modal, Slide, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useSpring, animated } from "react-spring";
import { rgba } from "polished";

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { transform: `translateY(300%)` },
    to: {
      transform: open ? `translateY(0px)` : `translateY(300%)`,
    },
    config: { duration: 225 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

const SortProductsModal = ({ isOpen, onClose, onChange }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Modal
      aria-labelledby="sort-product-modal"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      classes={{ root: "flex flex-col justify-end" }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            "& .MuiMenuItem-root.Mui-selected": {
              color:
                theme.palette.mode === "dark" ? "accent.main" : "accent.600",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? rgba("#2cad42", 0.08)
                  : rgba("#239e39", 0.08),
            },
          }}
          className="left-0 right-0 bottom-0 border-none bg-white p-[4px] shadow-none dark:bg-primary-900"
        >
          <MenuItem
            selected={router.query.sortBy === "newest" || !router.query.sortBy}
            onClick={(event) => {
              onClose();
              onChange(event.target.dataset.value);
            }}
            data-value="newest"
            classes={{
              selected: {
                backgroundColor:
                  theme.palette.mode === "dark" ? "accent.main" : "accent.600",
              },
            }}
          >
            جدیدترین
          </MenuItem>
          <MenuItem
            selected={router.query.sortBy === "bestSelling"}
            onClick={(event) => {
              onClose();
              onChange(event.target.dataset.value);
            }}
            data-value="bestSelling"
            classes={{
              root: {
                backgroundColor: "red",
              },
            }}
          >
            پرفروش ترین
          </MenuItem>
          <MenuItem
            selected={router.query.sortBy === "mostVisited"}
            onClick={(event) => {
              onClose();
              onChange(event.target.dataset.value);
            }}
            data-value="mostVisited"
          >
            پر بازدیدترین
          </MenuItem>
          <MenuItem
            selected={router.query.sortBy === "cheapest"}
            onClick={(event) => {
              onClose();
              onChange(event.target.dataset.value);
            }}
            data-value="cheapest"
          >
            ارزانترین
          </MenuItem>
          <MenuItem
            selected={router.query.sortBy === "mostExpensive"}
            onClick={(event) => {
              onClose();
              onChange(event.target.dataset.value);
            }}
            data-value="mostExpensive"
          >
            گرانترین
          </MenuItem>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SortProductsModal;
