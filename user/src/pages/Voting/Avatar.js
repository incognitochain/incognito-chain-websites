import React from "react";
import styled from "styled-components";

// Only support text for now
export function Avatar({ children }) {
  return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
  border-radius: 50%;
  background-color: #e6e9ff;
  color: #566ef5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 14px;
`;
