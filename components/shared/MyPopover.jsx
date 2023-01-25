import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

const MyPopover = ({ title: Title, children, ...otherProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      {...otherProps}
      className="relative flex flex-col transition-all"
      onMouseLeave={() => setIsOpen(false)}
    >
      {typeof Title === "string" ? (
        <button
          onMouseOver={() => setIsOpen(true)}
          className={`py-2 px-3 font-bold text-slate-400 hover:text-slate-400`}
        >
          {Title}
        </button>
      ) : (
        <div className="flex" onMouseOver={() => setIsOpen(true)}>
          {Title}
        </div>
      )}
      <Accordion
        expanded={isOpen}
        disableGutters
        className="!p-0"
        sx={{
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="!hidden !min-h-0 !p-0"
        />
        <AccordionDetails className="!absolute !top-full !right-0 !p-0 ">
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

MyPopover.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default MyPopover;
