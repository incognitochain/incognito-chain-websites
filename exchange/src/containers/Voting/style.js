import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from "@/settings/withDirection";
import bgImage from '@/image/portal-proposal-bg.png';
import {
  transition,
  boxShadow,
  borderRadius,
} from '@/settings/style-util';

const ApplicantList = styled.div`

  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  margin: 0 0 30px;

  .titleWrapper {
    width: 100%;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    h3 {
      font-size: 16px;
      font-weight: 500;
      text-transform: capitalize;
      color: ${palette("primary", 0)};
      line-height: 1.1;
    }
  }

  .searchWrapper {
    width: 100%;
    height: 40px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    background-color: ${palette("grayscale", 6)};

    input {
      font-size: 14px;
      font-weight: 400;
      color: ${palette("text", 2)};
      line-height: inherit;
      height: 39px;
      width: 100%;
      padding: 0 30px;
      margin-bottom: 0;
      border: 0;
      outline: 0 !important;
      overflow: hidden;
      background-color: ${palette("grayscale", 6)};
      ${borderRadius()};
      ${boxShadow()};
      ${transition()};

      &:focus,
      &:hover {
        border-color: transparent;
        ${boxShadow()};
      }

      @media only screen and (max-width: 767px) {
        padding: 0 20px;
      }

      &::-webkit-input-placeholder {
        color: ${palette("grayscale", 0)};
      }

      &:-moz-placeholder {
        color: ${palette("grayscale", 0)};
      }

      &::-moz-placeholder {
        color: ${palette("grayscale", 0)};
      }
      &:-ms-input-placeholder {
        color: ${palette("grayscale", 0)};
      }
    }

    .ant-input-suffix {
      display: none;
    }
  }
`;

const BioDetail = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid ${palette('border', 0)};
  margin: 0 0 30px;
  

  .isoNoMailMsg {
    font-size: 28px;
    font-weight: 300;
    text-transform: capitalize;
    color: ${palette("text", 2)};
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 137px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export { ApplicantList, BioDetail };