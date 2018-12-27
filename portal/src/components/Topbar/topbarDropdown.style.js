import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius, boxShadow } from "../../settings/style-util";
import WithDirection from "../../settings/withDirection";

const TopbarDropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin: -12px -16px;
  width: 260px;
  min-width: 160px;
  flex-shrink: 0;
  ${borderRadius("5px")};
  ${boxShadow("0 2px 10px rgba(0,0,0,0.2)")};
  ${transition()};

  @media only screen and (max-width: 767px) {
    width: 210px;
  }

  &.isoUserDropdown {
    padding: 7px 0;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    width: 140px;
    min-width: 120px;
    flex-shrink: 0;
    ${borderRadius("5px")};
    ${boxShadow("0 2px 10px rgba(0,0,0,0.2)")};
    ${transition()};

    .isoDropdownLink {
      font-size: 13px;
      color: ${palette("text", 1)};
      line-height: 1.1;
      padding: 7px 15px;
      background-color: transparent;
      text-decoration: none;
      display: flex;
      justify-content: flex-start;
      ${transition()};

      &:hover {
        background-color: ${palette("secondary", 6)};
      }
    }

    .lnkLanguage {
      font-size: 13px;
      color: ${palette("text", 1)};
      line-height: 1.1;
      padding: 7px 15px;
      background-color: transparent;
      text-decoration: none;
      ${transition()};
  
      img {
        margin-right: 1rem;
      }

      &:hover {
        background-color: ${palette("secondary", 6)};
      }
    }
  }
`;

export default WithDirection(TopbarDropdownWrapper);
