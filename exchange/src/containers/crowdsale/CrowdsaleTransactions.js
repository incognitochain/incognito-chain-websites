import React from "react";
import styled from "styled-components";

export const CrowdsaleTransactions = ({ transactions = [] }) => {
  return (
    <Wrapper>
      <Title>Transactions</Title>

      {transactions.map(transaction => {
        return (
          <Transaction key={transaction.ID}>
            <Field>
              <Label>TxID</Label>
              <Value>
                <a
                  href={`http://explorer.constant.money/tx/${transaction.TxID}`}
                >
                  {transaction.TxID}
                </a>
              </Value>
            </Field>
            <Field>
              <Label>Type</Label>
              <Value>{transaction.Side}</Value>
            </Field>

            <Field>
              <Label>Amount</Label>
              <Value>{transaction.Amount}</Value>
            </Field>
            <Field>
              <Label>Price Limit</Label>
              <Value>{transaction.PriceLimit}</Value>
            </Field>
          </Transaction>
        );
      })}
    </Wrapper>
  );
};

const Field = styled.div`
  display: flex;
  flex-direction: row;
`;

const Label = styled.div`
  width: 100px;
  font-size: 16px;
  color: #212b63;
`;
const Value = styled.div`
  flex: 1;
  color: #2c3b8f;
  font-size: 16px;
  a {
    color: #566ef5;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  background-color: white;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #212b63;
`;

const Transaction = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ebeffa;
`;
