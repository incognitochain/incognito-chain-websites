import React from 'react';
import styled from 'styled-components';
import { palette, font } from 'styled-theme';
import { borderRadius, transition, boxShadow } from '@/settings/style-util';
import WithDirection from '@/settings/withDirection';
import Badges from '@ui/uielements/badge';

const AntBadge = props => <Badges {...props} />;
const WDBadge = styled(AntBadge)`
  display: inline-block;

  &:not(.ant-badge-status) {
    margin-right: ${props => (props['data-rtl'] === 'rtl' ? '0' : '16px')};
    margin-left: ${props => (props['data-rtl'] === 'rtl' ? '16px' : '0')};
  }

  .ant-badge-status-dot {
    width: 10px;
    height: 10px;
  }

  i {
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
  }

  a {
    font-size: 13px;
    color: ${palette('primary', 0)};
  }

  .isoBadgeLink {
    width: 42px;
    height: 42px;
    ${borderRadius('6px')};
    background: ${palette('grayscale', 8)};
    display: inline-block;
  }

  .ant-badge-count {
    z-index: 1;
    background: ${palette('primary', 0)};
    font-family: ${font('primary', 0)};
    ${boxShadow('0 0 0 1px #fff')};
  }
  .ant-badge-status-text {
    margin-left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '1rem')};
    margin-right: ${props => (props['data-rtl'] === 'rtl' ? '1rem' : 'inherit')};
  }
`;

const BoardContents = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;

  .isoSingleMail {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    button {
      margin: 1rem;
      font-size: 1rem !important;
      padding: 0.5rem !important;
    }
  }
`;

const WDSingleMailHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem;
  flex-shrink: 0;

  h2 {
    font-size: 18px;
    font-weight: 400;
    color: ${palette('secondary', 2)};
    line-height: 1.5;
    margin: 0;
    text-align: left;
  }
`;

const WDBoardInfo = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 1rem;

  .isoRecipentsImg {
    width: 48px;
    height: 48px;
    display: -webkit-inline-flex;
    display: -ms-inline-flex;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    ${borderRadius('50%')};
    margin-bottom: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    span {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${palette('grayscale', 1)};
      font-size: 16px;
      font-weight: 300;
      color: #fff;
      letter-spacing: 1px;
    }
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: ${palette('text', 0)};
    margin: 0 0 2rem;
  }

  .isoMailAddress {
    width: 100%;
    padding: 0 0 2rem 0;
    display: flex;
    flex-direction: column;
    text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
    border-bottom: 1px solid ${palette('border', 0)};

    .isoAddress {
      width: 100%;

      i {
        font-size: 1.5rem;
        margin-right: 1rem;
        vertical-align: middle;
      }

      .mailEmail {
        padding-bottom: 0.5rem;
        font-size: 0.9rem;
        font-weight: 400;
        color: ${palette('text', 0)};
      }

      .voteNum {
        color: ${palette('text', 0)};
        font-size: 0.9rem;
        font-weight: 400;
        

        @media only screen and (max-width: 767px) {
          position: absolute;
          right: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
          left: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
        }
      }
    }

    p {
      font-size: 13px;
      font-weight: 400;
      color: ${palette('secondary', 2)};
      line-height: 1.1;

      span {
        font-size: inherit;
        font-weight: 700;
        color: ${palette('text', 0)};
      }
    }
  }
`;

const WDBoardList = styled.div`
  padding-top: 1.5rem;
  text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};
  flex-shrink: 0;

  h4 {
    padding-bottom: 1rem;
    font-weight: 400;
    font-size: 1rem;
    color: ${palette('primary', 0)};
  }


  .board {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    position: relative;
    padding: 0.5rem 0;

    .title {
      font-size: 0.9rem;
      font-weight: 400;
    }

    .number {
      font-size: 0.9rem;
      font-weight: 400;
      text-transform: lowercase;
    }
  }
`;

const WDSingleMailReply = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 35px;
  flex-shrink: 0;

  @media only screen and (max-width: 767px) {
    padding: 35px 20px;
  }

  .isoReplyMailBtn {
    width: 100%;
    height: 80px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;
    color: ${palette('text', 2)};
    border: 1px solid ${palette('border', 0)};
    padding: 10px 15px;

    span {
      font-size: inherit;
      color: ${palette('text', 2)};
      text-decoration: underline;
      padding: ${props => (props['data-rtl'] === 'rtl' ? '0 3px 0 0' : '0 0 0 3px')};
      cursor: pointer;
      ${transition()};

      &:hover {
        color: ${palette('primary', 0)};
      }
    }
  }
`;

const BoardInfo = WithDirection(WDBoardInfo);
const BoardList = WithDirection(WDBoardList);
const SingleMailReply = WithDirection(WDSingleMailReply);
const Badge = WithDirection(WDBadge);

export {
  BoardContents,
  BoardInfo,
  BoardList,
  SingleMailReply,
  Badge,
};
