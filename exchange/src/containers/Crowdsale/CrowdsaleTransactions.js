import React from "react";
import styled from "styled-components";
import Box from "@ui/utility/box";
import BoxTitle from '@ui/utility/boxTitle';
import {formatConstantValue} from "../../services/Formatter";

export const CrowdsaleTransactions = ({transactions = []}) => {
  return (
    <div className="wrapperHistoryList">
      <Box title="Related Transactions">

        {transactions.map(transaction => {
          return (
            <Transaction key={transaction.ID}>
              <Field>
                <Label>TxID</Label>
                <Value>
                  <a
                    href={`${process.env.explorerUrl}/tx/${transaction.TxID}`}
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
                <Label>Price per Unit</Label>
                <Value>{formatConstantValue(transaction.PricePerBond / 100)} const</Value>
              </Field>
              <Field>
                <Label>Total</Label>
                <Value>{formatConstantValue(transaction.PricePerBond * transaction.Amount / 100)} const</Value>
              </Field>
            </Transaction>
          );
        })}
      </Box>
    </div>
  );
};

const Field = styled.div`
  display: flex;
  flex-direction: row;
`;

const Label = styled.div`
  width: 100px;
  color: #212b63;
`;
const Value = styled.div`
  flex: 1;
  color: #2c3b8f;
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
  color: #212b63;
`;

const Transaction = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #ebeffa;
`;
