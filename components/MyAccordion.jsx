import React, { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const MyAccordion = ({
  className,
  title,
  open,
  children,
  iconClassName,
  buttonClassName,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleChange = () => {
    setIsOpen(isOpen ? false : true);
  };

  return (
    <Accordion
      expanded={isOpen}
      onChange={handleChange}
      className={`${className} relative block w-full !bg-transparent !bg-none transition-all !shadow-none`}
      {...otherProps}
    >
      <AccordionSummary
        expandIcon={
          <FontAwesomeIcon
            icon={faChevronDown}
            width={12}
            className={iconClassName}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={`${buttonClassName} flex w-full select-none items-center justify-between !px-2 text-lg leading-snug`}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails className="!py-0 !px-4">{children}</AccordionDetails>
    </Accordion>
  );
  return (
    <div className={`${className} relative block w-full transition-all`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClassName} flex w-full select-none items-center justify-between text-lg font-semibold leading-snug`}
      >
        {title}
        {/* <Icon
          icon="chevron-down"
          size={IconSize.LARGE}
          className={`${iconClassName} ${
            isOpen ? "rotate-180" : "rotate-0"
          } transition-all`}
        /> */}
      </button>
      {/* <Collapse isOpen={isOpen} className="px-2" keepChildrenMounted>
        {children}
      </Collapse> */}
    </div>
  );
};

export default MyAccordion;
