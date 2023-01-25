import React from "react";

import PulseLoader from "react-spinners/PulseLoader";
import { Backdrop, Modal, useTheme } from "@mui/material";

const LoadingComponent = ({ show }) => {
  const theme = useTheme();

  return (
    <Modal
      disable
      open={show}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <PulseLoader
        size={6}
        color={theme.palette.accent.main}
        loading={true}
        className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
      />
    </Modal>
  );
};

export default LoadingComponent;
