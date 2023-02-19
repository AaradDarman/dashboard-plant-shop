import React from "react";

import styled from "styled-components";
import Icon from "./Icon";

const StyledInputWraper = styled.form`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 4px;
`;

const StyledInput = styled.input`
  all: unset;
  padding: 0 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  ::placeholder {
    font-size: 13px;
  }
`;

const SearchInput = ({ value, onChange, className, placeholder }) => {
  return (
    <StyledInputWraper
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={`${className} rounded-full`}
    >
      <Icon
        icon="search"
        size={20}
        className="!mr-[2px] text-[#ffffff]/[.50]"
      />
      <StyledInput
        type="text"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value ?? ""}
        placeholder={placeholder}
        className="!flex-1"
      />
      <Icon
        className={!value && "!invisible"}
        icon="remove"
        size={20}
        onClick={() => {
          onChange("");
        }}
      />
    </StyledInputWraper>
  );
};

export default SearchInput;
