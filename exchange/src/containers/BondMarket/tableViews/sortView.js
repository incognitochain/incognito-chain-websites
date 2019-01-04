import React, { Component } from 'react';
import ContentHolder from '@ui/utility/contentHolder';
import ModalStyle, { ModalContent } from "./modal.style";
import TableWrapper , { DepositWrapper, WithdrawWrapper, MessageContent }  from './style';
import { Modal as Modals } from 'antd';
import WithDirection from "@/settings/withDirection";
import Button from "@ui/uielements/button";
import IntlMessages from '@ui/utility/intlMessages';
import QRCode from 'qrcode.react';
import Alert from "@ui/feedback/alert";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import message from '@ui/feedback/message';
import Input, {
  InputGroup,
} from '@ui/uielements/input';
import bondmarket from '@/services/BondMarket';

import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from '@ui/tables/helperCells';

const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);


const successCopy = () => {
  const msg = "Copy success!"//<IntlMessages id="Wallet.SymbolCode" />;
  message.success(
    <MessageContent>
      {msg}
    </MessageContent>,
    1
  );
};

const successWithdraw = () => {
  const msg = "Withdraw success!"//<IntlMessages id="Wallet.SymbolCode" />;
  message.success(
    <MessageContent>
      {msg}
    </MessageContent>,
    2
  );
};

const errorWithdraw = (msg) => {
  message.error(
    <MessageContent>
      {msg}
    </MessageContent>,
    2
  );
};

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(new Date(value));
    case 'LinkCell':
      return LinkCell(value);
    case 'NumberCell':
      return NumberCell(value);
    default:
      return TextCell(value);
  }
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      paymentAddress: props.paymentAddress,
      isDeposit: false,
      isWithdraw: false,
      coinSelected: false,
      wAmount: 0,
      wAddress: '',
      dataList: this.props.dataList.getAll(),
      loading: false,
    };
    this.columns = [
      {
        title: <IntlMessages id="BondMarket.Logo" />,
        key: 'BondImage',
        width: 200,
        render: obj => renderCell(obj, 'ImageCell', 'BondImage')
      },
      {
        title: <IntlMessages id="BondMarket.BondName" />,
        key: 'BondName',
        width: 200,
        render: obj => {
          return <span>{obj.BondName.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="BondMarket.Symbol" />,
        key: 'BondSymbol',
        width: 200,
        render: obj => {
          return <span>{obj.BondSymbol.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="BondMarket.ExpiredDate" />,
        key: 'BuyBackDate',
        width: 100,
        render: obj => renderCell(obj, 'DateCell', 'BuyBackDate')
      },
      {
        title: <IntlMessages id="BondMarket.Price" />,
        key: 'BuyBackPrice',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'BuyBackPrice')
      },
      {
        title: <IntlMessages id="BondMarket.TotalIssue" />,
        key: 'TotalIssue',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'TotalIssue')
      },
      {
        title: <IntlMessages id="BondMarket.Available" />,
        key: 'Available',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'Available')
      },
      {
        title: <IntlMessages id="BondMarket.Rate" />,
        key: 'Rate',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'Rate')
      },
      {
        title: "",
        key: 'action',
        width: 100,
        render: obj => {
          return (
            <div>
              <Button type="primary" className="btn" onClick={() => this.onBuy(obj)}>
                <IntlMessages id="BondMarket.Buy" />
              </Button>
            </div>
          );
        }
      }
    ];
  }

  onChange(pagination, filters, sorter) {
    const { dataList } = this.props;
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      this.setState({ dataList: dataList.getAll() });
    }
  }

  onDeposit(obj) {
    this.setState({ isDeposit: true, coinSelected: obj });
  }

  onWithdraw(obj) {
    this.setState({ isWithdraw: true, coinSelected: obj });
  }
  onBuy(obj) {

  }

  changeAmount = (e) => {
    let val = e.target.value ? e.target.value : Number(e.target.value);
    this.setState({ wAmount:  val});
  }

  changeAddress = (e) => {
    this.setState({ wAddress: e.target.value });
  }

  onExchange(obj) {console.log(obj);
    window.location.assign(`/exchange/${obj.SymbolCode.toUpperCase()}_BOND`);
  }

  handleCancel = () => {
    this.setState({ isDeposit: false, isWithdraw: false, });
  };



  renderWithdraw(){
    const { coinSelected, isWithdraw, paymentAddress } = this.state;
    const title = <IntlMessages id="Wallet.Withdraw" />;

    return (
      <Modal
          visible={isWithdraw}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>
              <IntlMessages id="Wallet.Withdraw.Cancel" />
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              loading={this.state.loading}
              onClick={this.handleWithdraw}
            >
              <IntlMessages id="Wallet.Withdraw.Submit" />
            </Button>
          ]}
        >
          <WithdrawWrapper>
            <div><IntlMessages id="Wallet.Withdraw.Amount" /></div>
            <InputGroup >
              <Input
                addonAfter="CONST"
                placeholder="0.00"
                onChange={(e) => this.changeAmount(e)}
              />
            </InputGroup>

            <div><IntlMessages id="Wallet.Withdraw.Address" /></div>
            <InputGroup >
              <Input onChange={(e) => this.changeAddress(e)} />
            </InputGroup>
          </WithdrawWrapper>
          <Alert
            message={
              <IntlMessages id="Wallet.Withdraw.WarningDescription" />
            }
            type="warning"
            style={{marginBottom: "10px"}}
          />
        </Modal>
    );
  }

  renderDeposit(){
    const { coinSelected, isDeposit, paymentAddress } = this.state;
    const title = <IntlMessages id="Wallet.Deposit" />;

    return (
      <Modal
          visible={isDeposit}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" type="primary" onClick={this.handleCancel}>
              <IntlMessages id="Wallet.Deposit.Done" />
            </Button>
          ]}
        >
          <Alert
            message={
              <IntlMessages id="Wallet.Deposit.WarningDescription" />
            }
            type="warning"
            style={{marginBottom: "10px"}}
          />
          <DepositWrapper>
            <p className="qrcode">
              <QRCode value={paymentAddress} size={200} renderAs="svg" />
            </p>
            <p className="address">
              {paymentAddress}
            </p>
            <p className="action">
              <CopyToClipboard text={paymentAddress} onCopy={successCopy}>
                <a><IntlMessages id="Wallet.Deposit.Copy" /></a>
              </CopyToClipboard>
            </p>
          </DepositWrapper>
          
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

        {
          this.renderDeposit()
        }
        {
          this.renderWithdraw()
        }
      </ContentHolder>
    );
  }
}
