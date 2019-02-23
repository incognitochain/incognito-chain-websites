import React from "react";
import styled from "styled-components";
import cls from "classnames";

export function CrowdsaleHistoryList({
  tokens = [],
  onClickItem,
  selectedTokenId
}) {
  return (
    <Wrapper>
      <Title>Bond List</Title>
      {tokens.map(token => {
        return (
          <ItemWrapper
            key={token.id}
            className={cls({ isSelected: token.id === selectedTokenId })}
            onClick={() => onClickItem(token.id)}
          >
            <Left>
              <img alt="token-icon" src={token.image} />
            </Left>
            <Right>
              <Text>{token.id || "!"}</Text>
              <Text>{token.name}</Text>
            </Right>
          </ItemWrapper>
        );
      })}
    </Wrapper>
  );
}

const Left = styled.div`
  width: 20px;
  margin-right: 10px;
  img {
    width: 20px;
    height: 20px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const Text = styled.div`
  font-size: 16px;
  color: #212b63;
`;

const Wrapper = styled.div`
  background-color: white;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
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
    pointer-events: none;
  }
`;
