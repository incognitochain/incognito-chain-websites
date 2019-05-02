import React from "react";
import styled from "styled-components";
import BreadcrumbBar from "@/containers/Breadcrumb/Breadcrumb";
import {notification} from "antd";
import axios from "axios";
import _ from "lodash";
import {} from "./CrowdsaleHistoryList";
import {CrowdsaleHistoryList} from "./CrowdsaleHistoryList";
import {CrowdsaleTransactions} from "./CrowdsaleTransactions";
import LayoutWrapper from "@ui/utility/layoutWrapper.js";
import "./CrowdSaleHistory.scss"

function initState() {
  return {
    isLoading: false,
    selectedTokenId: null,
    groupedTransactions: {},
    tokens: []
  };
}

const testData = [
  {
    ID: 1,
    TokenID: "0000000000000000000000000000000000000000000000000000000000000001",
    TokenName: "TokenName1",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PAVfiWe8geIAAAAjElEQVR4nOzasQ2AMAxFwWQSVmVsOmgtBQxEpkC6134dA5g0SZL0Vcs+tOYDRVEURVEURVWqraV1iqIoiqIoiqpXJ2Ps5nMURVEURVEUNa/+crmlKIqiKIqiKIqiKIqiKIqqUrE+quc3WIqiKIqiKIp6qeJ4+Wc/fZtKURRFURRFUXNKkiQVdwQAAP//Zdx8MyWkQr4AAAAASUVORK5CYII=",
    TxID: "1234567",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 2,
    TokenID: "0000000000000000000000000000000000000000000000000000000000000001",
    TokenName: "TokenName1",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PAVfiWe8geIAAAAjElEQVR4nOzasQ2AMAxFwWQSVmVsOmgtBQxEpkC6134dA5g0SZL0Vcs+tOYDRVEURVEURVWqraV1iqIoiqIoiqpXJ2Ps5nMURVEURVEUNa/+crmlKIqiKIqiKIqiKIqiKIqqUrE+quc3WIqiKIqiKIp6qeJ4+Wc/fZtKURRFURRFUXNKkiQVdwQAAP//Zdx8MyWkQr4AAAAASUVORK5CYII=",
    TxID: "1234567",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 3,
    TokenID: "0000000000000000000000000000000000000000000000000000000000000002",
    TokenName: "TokenName2",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PCB3eOTxZ8LAAAAmklEQVR4nOzaSwqDMBSG0XTUZXSp7VK7DEdRSCYRHwheIYTzDf9w5hcxSZKkZ3vPp2WKoiiKoiiKilefMk/t9C3Tv1leFf8oiqIoiqIoKlzV8latTluKoiiKoiiKilSpedz51Hr4QFEURVEURVF3Vf/XMkVRFEVRFDW26v8vAoqiKIqiKGpUdS2KoiiKoiiKilSSJCm4JQAA//89klRbW+URBQAAAABJRU5ErkJggg==",
    TxID: "22222222",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  },
  {
    ID: 4,
    TokenID: "0000000000000000000000000000000000000000000000000000000000000002",
    TokenName: "TokenName2",
    TokenImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PCB3eOTxZ8LAAAAmklEQVR4nOzaSwqDMBSG0XTUZXSp7VK7DEdRSCYRHwheIYTzDf9w5hcxSZKkZ3vPp2WKoiiKoiiKilefMk/t9C3Tv1leFf8oiqIoiqIoKlzV8latTluKoiiKoiiKilSpedz51Hr4QFEURVEURVF3Vf/XMkVRFEVRFDW26v8vAoqiKIqiKGpUdS2KoiiKoiiKilSSJCm4JQAA//89klRbW+URBQAAAABJRU5ErkJggg==",
    TxID: "33333333",
    Side: "Buy",
    Amount: 1,
    PriceLimit: 1
  }
];

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_HISTORY":
      return {
        ...state,
        isLoading: true
      };
    case "LOAD_HISTORY_SUCCESS":
      return {
        ...state,
        isLoading: false,
        tokens: action.tokens,
        groupedTransactions: action.groupedTransactions
      };
    case "LOAD_HISTORY_FAIL":
      return {
        ...state,
        isLoading: false
      };
    case "SELECT_TOKEN":
      return {
        ...state,
        selectedTokenId: action.selectedTokenId
      };
    default:
      return state;
  }
}

function getHistoryList(result) {
  const groupedTransactions = _.groupBy(result, "TokenID");

  const tokens = Object.keys(groupedTransactions).map(tokenID => {
    const firstItemWithToken = result.find(item => item.TokenID === tokenID);
    return {
      id: tokenID,
      name: firstItemWithToken.TokenName,
      image: firstItemWithToken.TokenImage
    };
  });

  return {
    tokens,
    groupedTransactions
  };
}

const loggerMiddleware = dispatch => action => {
  dispatch(action);
  process.env.NODE_ENV === "development" && console.log("dispatched:", action);
};

const CrowdsaleHistory = () => {
  let [state, dispatch] = React.useReducer(reducer, null, initState);

  dispatch = loggerMiddleware(dispatch);
  console.log("\tstate", state);

  React.useEffect(() => {
    loadCrowdsaleHistory();
  }, []);

  async function loadCrowdsaleHistory() {
    dispatch({type: "LOAD_HISTORY"});
    try {
      let response = await axios.get(
        `${process.env.serviceAPI}/bond-market/dcb/crowdsales_histories`
      );
      // TODO remove when live
      response = {data: {Result: testData}};
      if (response.data.Result) {
        dispatch({
          type: "LOAD_HISTORY_SUCCESS",
          ...getHistoryList(_.get(response, "data.Result", []))
        });
        dispatch({type: "SELECT_TOKEN", selectedTokenId: response.data.Result[0].TokenID})
      }
    } catch (e) {
      notification.error({message: "Load Crowdsale History Fail!"});
      dispatch({type: "LOAD_HISTORY_FAIL"});
    }
  }

  return (
    <div>
      <BreadcrumbBar
        urls={[
          {
            name: "Crowdsale",
            url: "/crowdsale"
          },
          {
            name: "History",
            url: "/crowdsale/history"
          }
        ]}
      />
      <LayoutWrapper>
        <div className={"wrapperBondHistory"}>
          <CrowdsaleHistoryList
            tokens={state.tokens}
            onClickItem={id =>
              dispatch({type: "SELECT_TOKEN", selectedTokenId: id})
            }
            selectedTokenId={state.selectedTokenId}
          />
          <CrowdsaleTransactions
            transactions={state.groupedTransactions[state.selectedTokenId]}
          />
        </div>
      </LayoutWrapper>
    </div>
  );
};
export default CrowdsaleHistory;
const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: row;
`;
