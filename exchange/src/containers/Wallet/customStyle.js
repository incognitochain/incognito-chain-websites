import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from "../../settings/style-util";

const TableStyle = styled.div`
  .ant-tabs-content {
    margin-top: 40px;
  }

  .ant-tabs-nav {
    > div {
      color: ${palette('secondary', 2)};

      &.ant-tabs-ink-bar {
        background-color: ${palette('primary', 0)};
      }

      &.ant-tabs-tab-active {
        color: ${palette('primary', 0)};
      }
    }
  }

  .btn {
    background-color: transparent !important;
    border-color: ${palette("primary", 7)} !important;
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
      color: ${palette("primary", 7)} !important;
    }

    &:hover {
      background-color: ${palette("primary", 2)};
      color: ${palette("primary", 2)} !important;
    }
  }
`;


export default TableStyle;
