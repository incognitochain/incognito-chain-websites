import React, {Component} from "react";
import Box from "@ui/utility/box";
import BoxTitle from '@ui/utility/boxTitle';
import LayoutWrapper from "@ui/utility/layoutWrapper.js";
import BreadcrumbBar from "@/containers/Breadcrumb/Breadcrumb";
import HistoryList from "@/containers/BondMarket/tableViews/HistoryList";
import BondList from "@/containers/BondMarket/tableViews/BondList";
import Input, {InputGroup} from "@ui/uielements/input";
import {WithdrawWrapper, MessageContent} from "./tableViews/style";
import IntlMessages from "@ui/utility/intlMessages";
import Alert from "@ui/feedback/alert";
import Button from "@ui/uielements/button";

import ModalStyle from "./tableViews/modal.style";
import {Modal as Modals} from "antd";
import WithDirection from "@/settings/withDirection";
import message from "@ui/feedback/message";

import bondmarket from "@/services/BondMarket";
import Loader from "@ui/utility/loader";

import "./BondHistory.scss";

const dataTest = {
  BondBuysHistory: {
    "0000000000000000000000000000000000000000000000000000000000000002": {
      TotalAmount: 100,
      BuyBackAvailable: 0,
      BondImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PAVfiWe8geIAAAAjElEQVR4nOzasQ2AMAxFwWQSVmVsOmgtBQxEpkC6134dA5g0SZL0Vcs+tOYDRVEURVEURVWqraV1iqIoiqIoiqpXJ2Ps5nMURVEURVEUNa/+crmlKIqiKIqiKIqiKIqiKIqqUrE+quc3WIqiKIqiKIp6qeJ4+Wc/fZtKURRFURRFUXNKkiQVdwQAAP//Zdx8MyWkQr4AAAAASUVORK5CYII=',
      BondSymbol: 'Test 1',
      BondName: 'Test 1',
      BondBuys: [
        {
          TxID: "KSDFJLDSKFJDSLJFDSLKJFSDKJFDKLSJSKDFDSLKFJSD",
          TokenID: "sdkjfdskfjdslkfjldskfjlsdkjfls",
          Amount: 120,
          BuyBackAvailable: true,
          BuyBackDate: "2019-01-10",
          MadeBuyBackDate: "2019-01-10"
        },
        {
          TxID: "sdkfjoi3uroi3uroi23foksdnvmdvorkwencmshwr3h",
          TokenID: "sdkjfdskfjdslkfjldskfjlsdkjfls",
          Amount: 120,
          BuyBackAvailable: true,
          BuyBackDate: "2019-01-10",
          MadeBuyBackDate: "2019-01-10"
        }
      ]
    },
    "0000000000000000000000000000000000000000000000000000000000000001": {
      TotalAmount: 100,
      BuyBackAvailable: 0,
      BondImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABEgsN2AAAABlBMVEXw8PCB3eOTxZ8LAAAAmklEQVR4nOzaSwqDMBSG0XTUZXSp7VK7DEdRSCYRHwheIYTzDf9w5hcxSZKkZ3vPp2WKoiiKoiiKilefMk/t9C3Tv1leFf8oiqIoiqIoKlzV8latTluKoiiKoiiKilSpedz51Hr4QFEURVEURVF3Vf/XMkVRFEVRFDW26v8vAoqiKIqiKGpUdS2KoiiKoiiKilSSJCm4JQAA//89klRbW+URBQAAAABJRU5ErkJggg==',
      BondSymbol: 'Test 2',
      BondName: 'Test 2',
      BondBuys: [
        {
          TxID: "KSDFJLDSKFJDSLJFDSLKJFSDKJFDKLSJSKDFDSLKFJSD",
          TokenID: "sdkjfdskfjdslkfjldskfjlsdkjfls",
          Amount: 120,
          BuyBackAvailable: true,
          BuyBackDate: "2019-01-10",
          MadeBuyBackDate: "2019-01-10"
        }
      ]
    }
  }
};

const successBuy = () => {
  const msg = "Buy success!"; //<IntlMessages id="Wallet.SymbolCode" />;
  message.success(<MessageContent>{msg}</MessageContent>, 2);
};

const errorBuy = msg => {
  message.error(<MessageContent>{msg}</MessageContent>, 2);
};

const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);

export default class BondHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bondList: [],
      data: {},
      selectedBondItem: null,
      selectedKey: null,
      isBuyBack: false,
      isValidate: true,
      clickedItem: null,
      loading: true,
      loadingBuy: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    this.setState({loading: true});
    let result = await bondmarket.getHistoryList();
    // TODO remove when live
    result = dataTest;
    if (!result.error) {
      const {BondBuysHistory = {}} = result;
      if (BondBuysHistory) {
        const keys = Object.keys(BondBuysHistory);
        const bonds = [];
        keys.forEach(key => {
          let object = BondBuysHistory[key];
          object.name = key;
          bonds.push(object);
        });
        if (keys.length > 0) {
          const firstKey = keys[0];
          const selectedItem = BondBuysHistory[firstKey];
          this.setState({
            selectedBondItem: selectedItem,
            selectedKey: firstKey,
          });
        }
        this.setState({bondList: bonds, data: BondBuysHistory});
      }
    } else {
      //return false;
    }
    this.setState({loading: false});
  }

  validate = ({amount}) => {
    if (amount <= 0) return false;
    return true;
  };

  handleOnBondClick = key => {
    const {data} = this.state;
    const selectedItem = data[key];
    this.setState({
      selectedBondItem: selectedItem,
      selectedKey: key,
    });
  };
  handleBuyBack = item => {
    this.setState({isBuyBack: true, clickedItem: item});
  };

  handleCancel = () => {
    this.setState({isBuyBack: false});
  };

  handleOnBuyClick = async () => {
    const {wAmount, isValidate, clickedItem} = this.state;
    if (isValidate) {
      this.setState({loadingBuy: true});
      const params = {
        amount: wAmount,
        buyBondID: clickedItem.ID
      };
      console.log("Params:", params);

      let result = await bondmarket.buyBack(params);
      if (result) {
        if (result === true) {
          successBuy();
          this.getData();
        } else if (result.error) {
          errorBuy(result.message);
        } else if (!result.Result) {
          errorBuy(result.Message);
        }
      }

      this.setState({isBuyBack: false, loadingBuy: false});
    }
  };

  handleOnHistoryItem = item => {
    this.props.history.push(`/tx/${item.TxID}`);
  };
  changeAmount = e => {
    let val = e.target.value ? e.target.value : Number(e.target.value);
    this.setState({wAmount: val, isValidate: this.validate({amount: val})});
  };

  renderBondList() {
    const {bondList, selectedKey} = this.state;
    return (
      <div className="wrapperBondList">
        <Box title={"List Bought Bond"}>
          <BondList list={bondList} onSelectBond={this.handleOnBondClick} selectedKey={selectedKey}/>
          <BoxTitle subtitle={bondList.length + " bonds"}></BoxTitle>
        </Box>
      </div>
    );
  }

  renderHistoryList() {
    const {selectedBondItem} = this.state;
    // debugger;
    return (
      <div className="wrapperHistoryList">
        <Box title="Related Transactions">
          {selectedBondItem && selectedBondItem.BondBuys && selectedBondItem.BondBuys.length > 0 ? (
            <HistoryList
              list={selectedBondItem.BondBuys}
              onBuyBack={this.handleBuyBack}
              onClickDetail={this.handleOnHistoryItem}
            />
          ) : <div>
            <div><span>No data</span></div>
            <div><a href={"/bond-market"}>Back to Bond Market</a></div>
          </div>}
        </Box>
      </div>
    );
  }

  renderBuyModal() {
    const {isBuyBack, isValidate} = this.state;
    const title = <IntlMessages id="BondMarket.Buy"/>;

    return (
      <Modal
        visible={isBuyBack}
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
            loading={this.state.loadingBuy}
            onClick={this.handleOnBuyClick}
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
            <Input
              addonAfter="BOND"
              placeholder="0.00"
              onChange={e => this.changeAmount(e)}
            />
          </InputGroup>
        </WithdrawWrapper>
        {!isValidate && (
          <Alert
            message={
              <IntlMessages id="BondMarket.BuyBack.WarningDescription"/>
            }
            type="warning"
            style={{marginBottom: "10px"}}
          />
        )}
      </Modal>
    );
  }

  renderBreadcrumb() {
    const urls = [
      {
        name: "Bond Market",
        url: "/bond-market"
      },
      {
        name: "History",
        url: "/bond-market/history"
      }
    ];

    return <BreadcrumbBar urls={urls}/>;
  }

  render() {
    const {loading} = this.state;
    if (loading) return <Loader/>;
    return (
      <div>
        {this.renderBreadcrumb()}
        <LayoutWrapper>
          <div className="wrapperBondHistory">
            {this.renderBondList()}
            {this.renderHistoryList()}
          </div>
          {this.renderBuyModal()}
        </LayoutWrapper>
      </div>
    );
  }
}
