import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from "@/settings/withDirection";
import bgImage from '@/assets/portal-proposal-bg.png';
import {
  borderRadius,
} from '@/settings/style-util';

const ShareWrapper = styled.div`
  margin-right: auto;
  margin-left: auto;
  text-align:center;
  margin-top: 2rem;

  h3 {
    color: ${palette('primary', 0)},
    font-weight: 400;
  }

  button {
    margin: 0.3rem;
  }
`;

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
`;

const ProposalBox = styled.div`
  background: url(${bgImage}) no-repeat center right;
  background-color: none;
  height: 276px;
  padding: 1rem 1.5rem;
  ${borderRadius('5px')};

  .desc {
    font-size:1rem;
    color: White;
    width: 60%;
    min-width: 120px;
    font-weight:500;
    padding: 2.5rem 0;

    .create {
      font-style: italic;
      color: ${palette('color', 5)};
    }
  }

  .action {
    display: flex;
    justify-content: space-between;

    .btn {
      background: #4CE2A7;
      border: solid 1px #0F79E1;
      color: White;
      padding: 0 15px;
    }
  }


`;

const WDFixedContainer = styled.div`
  max-width: 1140px;
  margin-right: auto;
  margin-left: auto;

  .cardBoard {
    .isoBoxSubTitle {
      width: 50%;
      min-width: 120px;
    }
  }

  .ant-row {
    .col:first-child {
      padding-left: 0px ! important;
    }

    .col:last-child {
      padding-right: 0px ! important;
    }
  }

  .btnApplied {
    background-color: #4CE2A7 !important;
    cursor: default;
    color: White;
  }

  .btnApply {
    background-color: unset !important;
    border: solid 1px ${palette('primary', 0)};
    color: ${palette('primary', 0)};
  }

  .mainBox {
    padding: 1.5rem;

    > div {
      display:flex;
      justify-content: space-between;

      .isoBoxTitle {
        font-size: 1rem;
        color: ${palette('primary', 0)};
      }

      .editBio {
        cursor:pointer;
      }
    }
  }

`;

const ApplyBoardWrapper = styled.div`
  padding: 0 5px;

  div.label {
    font-weight: 400;
    padding-bottom: 0.2rem;
    padding-top: 0.2rem;
  }
`;

const MessageContent = styled.p`
  display: inline-block;
  font-size: 13px;
`;


const FixedContainer = WithDirection(WDFixedContainer);
export { FixedContainer, ProposalBox, ShareWrapper, TableStyle, ApplyBoardWrapper, MessageContent };
