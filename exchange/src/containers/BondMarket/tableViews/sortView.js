import React, {Component} from "react";
import ContentHolder from "@ui/utility/contentHolder";
import PropTypes from "prop-types";
import ModalStyle from "./modal.style";
import TableWrapper, {WithdrawWrapper, MessageContent} from "./style";
import {Modal as Modals} from "antd";
import WithDirection from "@/settings/withDirection";
import Button from "@ui/uielements/button";
import IntlMessages from "@ui/utility/intlMessages";
import Alert from "@ui/feedback/alert";
import message from "@ui/feedback/message";
import {InputGroup} from "@ui/uielements/input";

import InputNumber from "@ui/uielements/InputNumber";
import bondmarket from "@/services/BondMarket";
import {nanoToConstant} from "@/helpers/utility";
import wallet from "@/services/Wallet";

import {
  DateCell,
  DateTimeCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from "@ui/tables/helperCells";
import {formatConstantValue} from "../../../services/Formatter";

const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);

const successBuy = () => {
  const msg = "Buy success!"; //<IntlMessages id="Wallet.SymbolCode" />;
  message.success(<MessageContent>{msg}</MessageContent>, 2);
};

const errorBuy = msg => {
  message.error(<MessageContent>{msg}</MessageContent>, 2);
};

const renderCell = (object, type, key, options = null) => {
  const value = object[key];
  switch (type) {
    case "ImageCell":
      return ImageCell(value, options);
    case "DateCell":
      return DateCell(new Date(value));
    case "DateTimeCell":
      // debugger;
      return DateTimeCell(new Date(value));
    case "LinkCell":
      return LinkCell(value);
    case "NumberCell":
      return NumberCell(Number(value), options);
    default:
      return TextCell(value);
  }
};

export default class extends Component {
  static propType = {
    onBuySuccess: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      isBuy: false,
      wAmount: 1,
      wRate: 0.1,
      dataList: this.props.dataList.getAll(),
      loading: false,
      isValidate: true,
      selectedItem: null,
      walletBalance: 0
    };
    this.columns = [
      /*{
        title: <IntlMessages id="BondMarket.Logo"/>,
        key: "BondImage",
        width: 200,
        render: obj => renderCell(obj, "ImageCell", "BondImage", {url: process.env.explorerUrl + "/token/" + obj["BondID"]})
      },*/
      {
        title: <IntlMessages id="BondMarket.BondName"/>,
        key: "BondName",
        width: 200,
        render: obj => {
          return <a target="_blank"
                    href={process.env.explorerUrl + "/token/" + obj["BondID"]}><img
            style={{margin: "10px", width: "50px", height: "50px"}}
            src={obj["BondImage"]}></img><span>{obj.BondName}</span></a>;
        }
      },
      /*{
        title: <IntlMessages id="BondMarket.Symbol"/>,
        key: "BondSymbol",
        width: 200,
        render: obj => {
          return <span>{obj.BondSymbol.toUpperCase()}</span>;
        }
      },*/
      {
        title: <IntlMessages id="BondMarket.ExpiredDate"/>,
        key: "BuyBackDate",
        width: 100,
        render: obj => renderCell(obj, "DateCell", "BuyBackDate")
      },
      {
        title: (
          <span style={{float: "right"}}>
            <IntlMessages id="BondMarket.Price"/>
          </span>
        ),
        key: "BuyBackPrice",
        width: 100,
        render: obj => {
          return (
            <span style={{float: "right"}}>{formatConstantValue(Number(nanoToConstant(obj.BuyBackPrice)))} const</span>
          );
        }
      },
      {
        title: <span style={{float: "right"}}><IntlMessages id="BondMarket.TotalIssue"/></span>,
        key: "TotalIssue",
        width: 80,
        render: obj => renderCell(obj, "NumberCell", "TotalIssue", {type: 'token'})
      },
      {
        title: <IntlMessages id="BondMarket.Available"/>,
        key: "Available",
        width: 80,
        render: obj => renderCell(obj, "DateTimeCell", "Available")
      },
      {
        title: <span style={{float: "right"}}><IntlMessages id="BondMarket.Rate"/></span>,
        key: "Rate",
        width: 100,
        render: obj => <span style={{float: "right"}}>{formatConstantValue(Number(nanoToConstant(obj.Rate)))} const</span>
      },
      {
        title: "",
        key: "action",
        width: 100,
        render: obj => {
          return (
            <div>
              <Button
                type="primary"
                className="btn"
                onClick={() => this.onBuy(obj)}
              >
                <IntlMessages id="BondMarket.Buy"/>
              </Button>
            </div>
          );
        }
      }
    ];
  }

  validate = ({amount, rate, balance}) => {
    console.log("Amount:", amount, "Rate:", rate, "Balance:", balance);
    if (amount <= 0) return false;
    if (rate <= 0) return false;
    if (amount * rate >= balance) return false;

    return true;
  };

  onChange(pagination, filters, sorter) {
    const {dataList} = this.props;
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      this.setState({dataList: dataList.getAll()});
    }
  }

  onBuy(obj) {
    this.setState({
      isBuy: true,
      selectedItem: obj,
      wRate: nanoToConstant(obj.Rate)
    });
  }

  changeAmount = val => {
    const {selectedItem} = this.state;
    const {Available = 1} = selectedItem;
    if (val >= Available) {
      val = Available;
    }

    this.setState({wAmount: val});
  };

  changeRate = val => {
    this.setState({wRate: val});
  };

  handleCancel = () => {
    this.setState({isBuy: false});
  };

  handleBuy = async () => {
    const {wAmount, wRate, selectedItem} = this.state;
    this.setState({loading: true});
    const constBalance = await wallet.getConstantBalance();
    this.setState({walletBalance: constBalance.AvailableBalance});
    const isValidate = await this.validate({
      amount: wAmount,
      rate: wRate,
      balance: constBalance.AvailableBalance
    });

    if (isValidate) {
      const params = {
        amount: wAmount,
        bondID: selectedItem.BondID,
        rate: wRate,
        bondName: selectedItem.BondName,
        bondSymbol: selectedItem.BondSymbol,
      };
      let result = await bondmarket.buy(params);
      console.log("Result:", result);
      if (result) {
        if (result === true) {
          successBuy();
          this.props.onBuySuccess();
        } else if (result.error) {
          errorBuy(result.message);
        } else if (!result.Result) {
          errorBuy(result.Message);
        }
      }
      this.setState({isBuy: false, isValidate, loading: false});
    } else {
      this.setState({isValidate, loading: false});
    }
  };

  renderBuy() {
    const {
      isBuy,
      isValidate,
      selectedItem,
      wAmount,
      wRate,
      walletBalance
    } = this.state;
    const title = <IntlMessages id="BondMarket.Buy"/>;
    const errorMsg = "Please enter amount and rate larger than 0 and in {{value}} CONST".replace(
      "{{value}}",
      walletBalance
    );
    return (
      <Modal
        visible={isBuy}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel}>
            <IntlMessages id="BondMarket.Buy.Cancel"/>
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.loading}
            onClick={this.handleBuy}
          >
            <IntlMessages id="BondMarket.Buy.Submit"/>
          </Button>
        ]}
      >
        <WithdrawWrapper>
          <div>
            <IntlMessages id="BondMarket.Buy.Amount"/>
          </div>
          <InputGroup>
            <InputNumber
              addonAfter="BOND"
              placeholder="0"
              min={1}
              max={selectedItem ? selectedItem.Available : 1}
              step={1}
              precision={0}
              value={wAmount}
              onChange={e => this.changeAmount(e)}
            />
          </InputGroup>
          <div>
            <IntlMessages id="BondMarket.Rate"/>
          </div>
          <InputGroup>
            <InputNumber
              //addonAfter="BOND"
              placeholder="0.0"
              value={wRate}
              step={0.1}
              precision={1}
              min={selectedItem ? nanoToConstant(selectedItem.Rate) : 0.1}
              onChange={e => this.changeRate(e)}
            />
          </InputGroup>
        </WithdrawWrapper>
        {!isValidate && (
          <Alert
            message={errorMsg}
            type="warning"
            style={{marginBottom: "10px"}}
          />
        )}
      </Modal>
    );
  }

  render() {
    return (
      <ContentHolder>
        <TableWrapper
          columns={this.columns}
          onChange={this.onChange}
          dataSource={this.state.dataList}
          className="isoSortingTable"
        />
        {this.renderBuy()}
      </ContentHolder>
    );
  }
}
