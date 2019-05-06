import React from "react";
import styled from "styled-components";
import PageHeader from "@ui/utility/pageHeader";
import IntlMessages from "@ui/utility/intlMessages";
import axios from "axios";
import _ from "lodash";
import {notification, Table} from "antd";
import Button from "@ui/uielements/button";
import {BuyModal} from "./BuyModal";
import {SellModal} from "./SellModal";
import BreadcrumbBar from "@/containers/Breadcrumb/Breadcrumb";
import {formatConstantValue, formatTokenAmount} from "../../services/Formatter";

const renderIf = cond => comp => (cond ? comp : null);

const mapTypeToTextColor = {
  sellable: "rgb(112, 168, 0)",
  buyable: "rgb(234, 0, 112)"
};

const mapTypeToButtonBackground = {
  sellable: "rgb(234, 0, 112)",
  buyable: "rgb(112, 168, 0)"
};

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

const testData = {
  "Result": [
    {
      "SaleID": "0100000000000000000000000000000000000000000000000000000000000000",
      "EndBlock": 1000,
      "BuyingAsset": "4c420b974449ac188c155a7029706b8419a591ee398977d00000000000000000",
      "BuyingAmount": 1000,
      "Price": 200,
      "SellingAsset": "0000000000000000000000000000000000000000000000000000000000000004",
      "TokenImage": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PAVfiWe8geIAAAAjElEQVR4nOzasQ2AMAxFwWQSVmVsOmgtBQxEpkC6134dA5g0SZL0Vcs+tOYDRVEURVEURVWqraV1iqIoiqIoiqpXJ2Ps5nMURVEURVEUNa/+crmlKIqiKIqiKIqiKIqiKIqqUrE+quc3WIqiKIqiKIp6qeJ4+Wc/fZtKURRFURRFUXNKkiQVdwQAAP//Zdx8MyWkQr4AAAAASUVORK5CYII=',
      "Type": "sellable"
    },
    {
      "SaleID": "0200000000000000000000000000000000000000000000000000000000000000",
      "EndBlock": 2000,
      "BuyingAsset": "0000000000000000000000000000000000000000000000000000000000000004",
      "SellingAsset": "4c420b974449ac188c155a7029706b8419a591ee398977d00000000000000000",
      "SellingAmount": 5000,
      "Price": 300,
      "TokenImage": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PDToAKxYbCAAAAAlklEQVR4nOzaMQqEMBBA0U21x/CoelSPYaWCphhIE1RCCO+3mWc9yPwkSVKL0lG0URRFURRFUVQLlZuv+bV6nqIoiqIoiqIeqSmsq3v5/I/r7EJRFEVRFEVRFEVRFEVRFDWAiqX4eH+u/h6AoiiKoiiKol6oXGdXBBRFURRFUdSoqv8/txRFURRFUdSoSpIkfdwZAAD//xGuA8je9ci/AAAAAElFTkSuQmCC',
      "Type": "buyable"
    }
  ],
  "Error": null,
  "Id": 1
}

export default function Crowdsale() {
  let [state, dispatch] = React.useReducer(reducer, null, initState);

  dispatch = loggerMiddleware(dispatch);
  console.log("\tstate", state);

  React.useEffect(() => {
    loadCrowdsales();
  }, []);

  async function loadCrowdsales() {
    dispatch({type: "LOAD_CROWDSALES"});

    try {
      let [
        crowdsalesRes,
        sellingAssetOptionsRes,
        buyingAssetOptionRes
      ] = await Promise.all([
        axios.get(`${process.env.serviceAPI}/bond-market/dcb/crowdsales`),
        axios.get(`${process.env.serviceAPI}/voting/proposalsellingassets`),
        axios.get(`${process.env.serviceAPI}/voting/proposalbuyingassets`)
      ]);
      // TODO remove when live
      crowdsalesRes.data = testData;
      const sellingAssetOptions = Object.entries(
        _.get(sellingAssetOptionsRes, "data.Result", {})
      );
      const buyingAssetOptions = Object.entries(
        _.get(buyingAssetOptionRes, "data.Result", {})
      );

      dispatch({
        type: "LOAD_CROWDSALES_SUCCESS",
        crowdsales: (_.get(crowdsalesRes, "data.Result", []) || []).map(
          item => ({
            ...item,
            BuyingAssetLabel: buyingAssetOptions.find(
              option => option[1] === item.BuyingAsset
            )[0],
            SellingAssetLabel: sellingAssetOptions.find(
              option => option[1] === item.SellingAsset
            )[0]
          })
        )
      });
    } catch (e) {
      console.error(e);
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
    <>
      <BreadcrumbBar
        urls={[
          {
            name: "Bond Crowdsale",
            url: "/crowdsale"
          },
          {
            name: "History",
            url: "/crowdsale/history"
          }
        ]}
      />
      <Wrapper>
        <PageHeader>{<IntlMessages id="Crowdsale.PageHeader"/>}</PageHeader>
        <TableWrapper>
          {renderIf(!state.isLoading && state.crowdsales.length)(
            <Table
              columns={[
                {
                  title: "Crowdsale",
                  key: "Type",
                  render: (_, record) => {
                    return (
                      <div style={{color: mapTypeToTextColor[record.Type], fontWeight: "bold"}}>
                        {record.Type === "buyable" ? "DCB's Selling " : "DCB's Buying "}
                      </div>
                    );
                  }
                },
                {
                  title: "Crowdsale Asset",
                  key: "Asset",
                  render: (_, record) => {
                    return (
                      <div style={{color: mapTypeToTextColor[record.Type]}}>
                        <a
                          href={process.env.explorerUrl + "/token/" + (record.Type === "buyable" ? record.SellingAsset : record.BuyingAsset)}><img
                          src={record.TokenImage} style={{
                          width: "50px",
                          height: "50px",
                          margin: "10px"
                        }}></img>{record.Type === "buyable" ? record.SellingAssetLabel : record.BuyingAssetLabel}
                        </a>
                      </div>
                    );
                  }
                },
                {
                  title: "Amount",
                  key: "Amount",
                  render: (_, record) => (
                    <div style={{color: mapTypeToTextColor[record.Type]}}>
                      {record && record.Type === "buyable" ? formatTokenAmount(record.SellingAmount) : formatTokenAmount(record.BuyingAmount)}
                    </div>
                  )
                },
                {
                  title: "Price / Unit",
                  dataIndex: "Price",
                  key: "Price",
                  sortDirections: ["descend", "ascend"],
                  render: (_, record) => (
                    <div style={{color: mapTypeToTextColor[record.Type]}}>
                      {formatConstantValue(record.Price / 100)} const
                    </div>
                  )
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
                        style={{
                          backgroundColor: mapTypeToButtonBackground["sellable"]
                        }}
                      >
                        Sell
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        className="btn"
                        onClick={() => onClickBuy(record)}
                        style={{
                          backgroundColor: mapTypeToButtonBackground["buyable"]
                        }}
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
            <p style={{textAlign: "center",}}>
              <IntlMessages id="Crowdsale.DataNotFound"/>
            </p>
          )}
        </TableWrapper>
        <BuyModal
          isShow={state.isShowBuyModal}
          onClose={() => dispatch({type: "CLOSE_BUY_MODAL"})}
          record={state.crowdsales[state.recordIndex]}
          loadCrowdsales={loadCrowdsales}
        />
        <SellModal
          isShow={state.isShowSellModal}
          onClose={() => dispatch({type: "CLOSE_SELL_MODAL"})}
          record={state.crowdsales[state.recordIndex]}
          loadCrowdsales={loadCrowdsales}
        />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  padding: 2rem;
`;

const TableWrapper = styled.div`
  background-color: white;
  padding: 2rem;
`;
