import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from "@/settings/withDirection";
import bgImage from '@/image/portal-proposal-bg.png';
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
  padding: 1.5rem;
  ${borderRadius('5px')};

  .desc {
    font-size:1rem;
    color: White;
    width: 50%;
    min-width: 120px;
    font-weight:500;
    padding: 1.5rem 0;
  }

  .btn {
    background: #4CE2A7;
    border: solid 1px #0F79E1;
    color: White;
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
`;

const FixedContainer = WithDirection(WDFixedContainer);
export { FixedContainer, ProposalBox, ShareWrapper, TableStyle };