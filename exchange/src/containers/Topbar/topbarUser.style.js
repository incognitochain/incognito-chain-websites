import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius } from "../../settings/style-util";
import WithDirection from "../../settings/withDirection";

const TopbarUserWrapper = styled.div`
  display: flex;
  padding-top: 1rem;
  .btnSignin {
    border: 0 !important;
    height: 30px !important;
    padding: 0 15px !important;
    margin-left: ${props =>
      props["data-rtl"] === "rtl" ? "inherit" : "1rem"};
    margin-right: ${props =>
      props["data-rtl"] === "rtl" ? "1rem" : "inherit"};
    ${borderRadius("3px")};
    ${transition()};

    span {
      font-size: 1rem;
      font-weight: 300;
      padding: 0;
      color: #ffffff;
    }

    &:hover {
      background-color: ${palette("primary", 1)};
    }
  }

  .btnSignup {
    background-color: ${palette("primary", 1)} !important;
    border: 0 !important;
    height: 30px !important;
    padding: 0 15px !important;
    margin-left: ${props =>
      props["data-rtl"] === "rtl" ? "inherit" : "1rem"};
    margin-right: ${props =>
      props["data-rtl"] === "rtl" ? "1rem" : "inherit"};
    ${borderRadius("3px")};
    ${transition()};

    span {
      font-size: 1rem;
      font-weight: 300;
      padding: 0;
      color: #ffffff;
    }

    &:hover {
      background-color: ${palette("primary", 2)};
    }
  }

  .btnLanguage {
    background-color: transparent !important;
    border-color: ${palette("primary", 2)} !important;
    height: 30px !important;
    padding: 0 15px !important;
    margin-left: ${props =>
      props["data-rtl"] === "rtl" ? "inherit" : "1rem"};
    margin-right: ${props =>
      props["data-rtl"] === "rtl" ? "1rem" : "inherit"};
    ${borderRadius("3px")};
    ${transition()};

    span {
      font-size: 0.9rem;
      font-weight: 300;
      padding: 0;
      color: #ffffff;
    }

    &:hover {
      background-color: ${palette("primary", 2)};
    }
  }
`;

export default WithDirection(TopbarUserWrapper);
