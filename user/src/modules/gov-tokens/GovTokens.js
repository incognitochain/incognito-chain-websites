import React from "react";
import styled from "styled-components";
import { notification, Table, Button, Tabs, Tooltip } from "antd";
import axios from "axios";
import _ from "lodash";
import { BuyModal } from "./BuyModal";

const TabPane = Tabs.TabPane;

const renderIf = cond => comp => (cond ? comp : null);

function initState() {
  return {
    isLoading: false,
    data: []
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_GOV_TOKENS":
      return { ...state, isLoading: true };
    case "LOAD_GOV_TOKENS_SUCCESS":
      return { ...state, isLoading: false, data: action.data };
    case "LOAD_GOV_TOKENS_FAIL":
      return { ...state, isLoading: false };
    case "OPEN_BUY_MODAL":
      return { ...state, isShowBuyModal: true };
    case "CLOSE_BUY_MODAL":
      return { ...state, isShowBuyModal: false };
    default:
      return state;
  }
}

const loggerMiddleware = dispatch => action => {
  dispatch(action);
  process.env.NODE_ENV === "development" && console.log("dispatched:", action);
};

export function GovTokens() {
  let [state, dispatch] = React.useReducer(reducer, null, initState);

  dispatch = loggerMiddleware(dispatch);
  console.log("\tstate", state);

  React.useEffect(() => {
    loadGovTokens();
  }, []);

  async function loadGovTokens() {
    dispatch({ type: "LOAD_GOV_TOKENS" });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_API}/wallet/curr_selling_gov_tokens`
      );
      dispatch({
        type: "LOAD_GOV_TOKENS_SUCCESS",
        data: getData(_.get(response, "data.Result", {}) || {})
      });
    } catch (e) {
      notification.error({
        message: `${e.response.status} error on load GOV TOKENS`
      });
      dispatch({ type: "LOAD_GOV_TOKENS_FAIL" });
    }
  }

  // convert 1 item to array because of table
  function getData(data) {
    if (Array.isArray(data)) return data;
    return _.isEmpty(data) ? [] : [data];
  }

  function onClickBuy() {
    dispatch({ type: "OPEN_BUY_MODAL" });
  }

  return (
    <div className="container">
      <div className="row">
        <Wrapper className="col-12 col-lg-12">
          <Tabs animated={false}>
            <TabPane tab="GOV Tokens" key="1">
              <TableWrapper>
                {renderIf(!state.isLoading)(
                  <Table
                    columns={[
                      {
                        title: "GOV Token ID",
                        key: "GOVTokenID",
                        dataIndex: "GOVTokenID",
                        render(text) {
                          return (
                            <Tooltip title={text} placement="bottom">
                              {text.slice(0, 6)}
                            </Tooltip>
                          );
                        }
                      },
                      {
                        title: "Start Selling At",
                        key: "StartSellingAt",
                        dataIndex: "StartSellingAt"
                      },
                      {
                        title: "End Selling At",
                        key: "EndSellingAt",
                        dataIndex: "EndSellingAt"
                      },
                      {
                        title: "Buy Price",
                        key: "BuyPrice",
                        dataIndex: "BuyPrice"
                      },
                      {
                        title: "Total Issue",
                        key: "TotalIssue",
                        dataIndex: "TotalIssue"
                      },
                      {
                        title: "Available",
                        key: "Available",
                        dataIndex: "Available"
                      },
                      {
                        key: "Buy",
                        render(_, record) {
                          return (
                            <Button
                              type="primary"
                              onClick={() => onClickBuy(record)}
                            >
                              Buy
                            </Button>
                          );
                        }
                      }
                    ]}
                    rowKey={record => record.GOVTokenID}
                    dataSource={state.data}
                  />
                )}
              </TableWrapper>
            </TabPane>
            <TabPane tab="History" key="2">
              History
            </TabPane>
          </Tabs>
        </Wrapper>
      </div>

      <BuyModal
        isShow={state.isShowBuyModal}
        record={state.data[0]}
        loadGovTokens={loadGovTokens}
        onClose={() => dispatch({ type: "CLOSE_BUY_MODAL" })}
      />
    </div>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const TableWrapper = styled.div`
  flex: 1;
  background-color: white;

  .ant-pagination {
    display: none;
  }
`;
