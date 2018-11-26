import React, { Component } from 'react';
import ContentHolder from "@/components/utility/contentHolder";
import ModalStyle, { ModalContent } from "./modal.style";
import TableWrapper , { DepositWrapper, WithdrawWrapper, MessageContent }  from './style';
import { Modal as Modals } from 'antd';
import WithDirection from "@/settings/withDirection";
import Button from "@/components/uielements/button";
import IntlMessages from '@/components/utility/intlMessages';
import QRCode from 'qrcode.react';
import Alert from "@/components/feedback/alert";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import message from "@/components/feedback/message";
import Input, {
  InputGroup,
} from '../../../components/uielements/input';

import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from '@/components/tables/helperCells';

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
    1
  );
};

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
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
      isDeposit: false,
      isWithdraw: false,
      coinSelected: false,
      dataList: this.props.dataList.getAll(),
    };
    this.columns = [
      {
        title: <IntlMessages id="Wallet.SymbolName" />,
        key: 'symbolName',
        width: 200,
        render: obj => {
          return <span>{obj.symbolName.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="Wallet.SymbolCode" />,
        key: 'symbolCode',
        width: 200,
        render: obj => {
          return <span>{obj.symbolCode.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="Wallet.TotalBalance" />,
        key: 'totalBalance',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'totalBalance')
      },
      {
        title: <IntlMessages id="Wallet.AvailableBalance" />,
        key: 'availableBalance',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'availableBalance')
      },
      {
        title: <IntlMessages id="Wallet.InOrder" />,
        key: 'inOrder',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'inOrder')
      },
      {
        title: <IntlMessages id="Wallet.ConstantValue" />,
        key: 'constantValue',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'constantValue')
      },
      {
        title: "",
        key: 'action',
        width: 100,
        render: obj => {
          return (
            <div>
              <Button type="primary" className="btn" onClick={() => this.onDeposit(obj)}>
                <IntlMessages id="Wallet.Deposit" />
              </Button>
    
              <Button type="primary" className="btn" onClick={() => this.onWithdraw(obj)}>
                <IntlMessages id="Wallet.Withdraw" />
              </Button>
    
              <Button type="primary" className="btn" onClick={() => this.onExchange(obj)}>
                <IntlMessages id="Wallet.Exchange" />
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

  onExchange(obj) {
    //console.log(obj);
    window.location.href = '/?market' + obj.symbolCode;
  }

  handleCancel = () => {
    this.setState({ isDeposit: false, isWithdraw: false, });
  };

  handleWithdraw = () => {
    this.setState({ isDeposit: false, isWithdraw: false, });
  };

  renderWithdraw(){
    const { coinSelected, isWithdraw } = this.state;
    const title = <IntlMessages id="Wallet.Withdraw" />;
    const paymentAddress = "1Uv12YEcd5w5Qm79sTGHSHYnCfVKM2ui8mbapD1dgziUf9211b5cnCSdxVb1DoXyDD19V1THMSnaAWZ18sJtmaVnh56wVhwb1HuYpkTa4";

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
              />
            </InputGroup>

            <div><IntlMessages id="Wallet.Withdraw.Address" /></div>
            <InputGroup >
              <Input />
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
    const { coinSelected, isDeposit } = this.state;
    const title = <IntlMessages id="Wallet.Deposit" />;
    const paymentAddress = "1Uv12YEcd5w5Qm79sTGHSHYnCfVKM2ui8mbapD1dgziUf9211b5cnCSdxVb1DoXyDD19V1THMSnaAWZ18sJtmaVnh56wVhwb1HuYpkTa4";

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
