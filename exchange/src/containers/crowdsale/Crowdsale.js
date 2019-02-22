import React from "react";
import styled from "styled-components";
import PageHeader from "@ui/utility/pageHeader";
import IntlMessages from "@ui/utility/intlMessages";
import axios from "axios";
import _ from "lodash";
import { notification, Table } from "antd";
import Button from "@ui/uielements/button";
import { BuyModal } from "./BuyModal";
import { SellModal } from "./SellModal";

const renderIf = cond => comp => (cond ? comp : null);

function initState() {
  return {
    isLoading: false,
    crowdsales: []
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_CROWDSALES":
      return {
        ...state,
        isLoading: true
      };
    case "LOAD_CROWDSALES_SUCCESS":
      return {
        ...state,
        isLoading: false,
        crowdsales: action.crowdsales
      };
    case "LOAD_CROWDSALES_FAIL":
      return {
        ...state,
        isLoading: false
      };
    case "SHOW_SELL_MODAL":
      return {
        ...state,
        isShowSellModal: true,
        recordIndex: action.recordIndex
      };
    case "CLOSE_SELL_MODAL":
      return {
        ...state,
        isShowSellModal: false
      };
    case "SHOW_BUY_MODAL":
      return {
        ...state,
        isShowBuyModal: true,
        recordIndex: action.recordIndex
      };
    case "CLOSE_BUY_MODAL":
      return {
        ...state,
        isShowBuyModal: false
      };
    default:
      return state;
  }
}

const loggerMiddleware = dispatch => action => {
  dispatch(action);
  process.env.NODE_ENV === "development" && console.log("dispatched:", action);
};

export default function Crowdsale() {
  let [state, dispatch] = React.useReducer(reducer, null, initState);

  dispatch = loggerMiddleware(dispatch);
  console.log("\tstate", state);

  React.useEffect(() => {
    loadCrowdsales();
  }, []);

  async function loadCrowdsales() {
    dispatch({ type: "LOAD_CROWDSALES" });

    try {
      const [
        crowdsalesRes,
        sellingAssetOptionsRes,
        buyingAssetOptionRes
      ] = await Promise.all([
        axios.get(`${process.env.serviceAPI}/bond-market/dcb/crowdsales`),
        axios.get(`${process.env.serviceAPI}/voting/proposalsellingassets`),
        axios.get(`${process.env.serviceAPI}/voting/proposalbuyingassets`)
      ]);

      const sellingAssetOptions = Object.entries(
        _.get(sellingAssetOptionsRes, "data.Result", {})
      );
      const buyingAssetOptions = Object.entries(
        _.get(buyingAssetOptionRes, "data.Result", {})
      );

      dispatch({
        type: "LOAD_CROWDSALES_SUCCESS",
        crowdsales: _.get(crowdsalesRes, "data.Result", []).map(item => ({
          ...item,
          BuyingAssetLabel: buyingAssetOptions.find(
            option => option[1] === item.BuyingAsset
          )[0],
          SellingAssetLabel: sellingAssetOptions.find(
            option => option[1] === item.SellingAsset
          )[0]
        }))
      });
    } catch (e) {
      notification.error({
        message: `Fail to request crowdsales`
      });
      dispatch({
        type: "LOAD_CROWDSALES_FAIL"
      });
    }
  }

  function onClickSell(record) {
    dispatch({
      type: "SHOW_SELL_MODAL",
      recordIndex: state.crowdsales.indexOf(record)
    });
  }

  function onClickBuy(record) {
    dispatch({
      type: "SHOW_BUY_MODAL",
      recordIndex: state.crowdsales.indexOf(record)
    });
  }

  return (
    <Wrapper>
      <PageHeader>{<IntlMessages id="Crowdsale.PageHeader" />}</PageHeader>
      <TableWrapper>
        {renderIf(!state.isLoading && state.crowdsales.length)(
          <Table
            columns={[
              {
                title: "Buying Asset",
                dataIndex: "BuyingAssetLabel",
                key: "BuyingAssetLabel"
              },
              {
                title: "Buying Amount",
                dataIndex: "BuyingAmount",
                key: "BuyingAmount",
                sorter: (a, b) => {
                  return a.BuyingAmount - b.BuyingAmount;
                },
                sortDirections: ["descend", "ascend"]
              },
              {
                title: "Selling Asset",
                dataIndex: "SellingAssetLabel",
                key: "SellingAssetLabel"
              },
              {
                title: "Selling Amount",
                dataIndex: "SellingAmount",
                key: "SellingAmount",
                sorter: (a, b) => {
                  return a.BuyingAmount - b.BuyingAmount;
                },
                sortDirections: ["descend", "ascend"]
              },
              {
                title: "",
                dataIndex: "Type",
                key: "Type",
                render: (type, record) =>
                  type === "sellable" ? (
                    <Button
                      type="primary"
                      className="btn"
                      onClick={() => onClickSell(record)}
                    >
                      Sell
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="btn"
                      onClick={() => onClickBuy(record)}
                    >
                      Buy
                    </Button>
                  )
              }
            ]}
            dataSource={state.crowdsales}
            rowKey={record => record.SaleID}
          />
        )}
        {renderIf(!state.isLoading && !state.crowdsales.length)(
          <p>
            <IntlMessages id="Crowdsale.DataNotFound" />
          </p>
        )}
      </TableWrapper>

      <BuyModal
        isShow={state.isShowBuyModal}
        onClose={() => dispatch({ type: "CLOSE_BUY_MODAL" })}
        record={state.crowdsales[state.recordIndex]}
      />
      <SellModal
        isShow={state.isShowSellModal}
        onClose={() => dispatch({ type: "CLOSE_SELL_MODAL" })}
        record={state.crowdsales[state.recordIndex]}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 2rem;
`;

const TableWrapper = styled.div`
  background-color: white;
  padding: 2rem;
`;
