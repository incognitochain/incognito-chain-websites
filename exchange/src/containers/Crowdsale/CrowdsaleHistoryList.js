import React from "react";
import styled from "styled-components";
import cls from "classnames";
import _ from "lodash";
import {Tooltip} from "antd";
import Box from "@ui/utility/box";
import BoxTitle from '@ui/utility/boxTitle';
import {formatHashStr} from "../../services/Formatter";

export function CrowdsaleHistoryList({
                                       tokens = [],
                                       onClickItem,
                                       selectedTokenId
                                     }) {
  return (
    <div className="wrapperBondList">
      <Box title={"List Bought Bond"}>
        {tokens && tokens.length > 0 ? tokens.map(token => {
          const isSelected = token.id === selectedTokenId;
          return (
            <ItemWrapper
              key={token.id}
              className={cls({isSelected})}
              onClick={() => {
                !isSelected && onClickItem(token.id);
              }}
            >
              <Left>
                <a target="_blank"
                   href={process.env.explorerUrl + '/token/' + token.id}><img className={"bondImage"} alt="token-icon"
                                                                              src={token.image}/></a>
              </Left>
              <Right>
                <Text>{token.name}</Text>
                {/*<Tooltip placement="bottom" title={token.id}>*/}
                <Text><a className={"tokenLink"} target="_blank"
                         href={process.env.explorerUrl + '/token/' + token.id}>{formatHashStr(token.id, true)}</a></Text>
                {/*</Tooltip>*/}
              </Right>
            </ItemWrapper>
          );
        }) : "No data"}
        <BoxTitle subtitle={tokens.length + " bonds"}></BoxTitle>
      </Box>
    </div>
  );
}

const Left = styled.div`
  width: 50px;
  margin-right: 10px;
  img {
    width: 50px;
    height: 50px;
  }
`;

const Right = styled.div`
  flex: 1;
  @media only screen and (max-device-width: 640px) {
    float: left;
  }
`;

const Text = styled.div`
  color: #212b63;
`;

const Wrapper = styled.div`
  background-color: white;
  padding: 20px;
  width: 400px;
`;

const Title = styled.div`
  color: #212b63;
`;

const ItemWrapper = styled.div`
  border-bottom: 1px solid #ebeffa;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;

  &:hover {
    background-color: #f9fafb;
  }

  &.isSelected {
    background-color: #f9fafb;
    cursor: default;
  }
`;
