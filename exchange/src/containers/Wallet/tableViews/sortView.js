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
import wallet from '@/services/Wallet';

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
        title: <IntlMessages id="Wallet.SymbolName" />,
        key: 'SymbolName',
        width: 200,
        render: obj => {
          return <span>{obj.SymbolName.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="Wallet.SymbolCode" />,
        key: 'SymbolCode',
        width: 200,
        render: obj => {
          return <span>{obj.SymbolCode.toUpperCase()}</span>
        }
      },
      {
        title: <IntlMessages id="Wallet.TotalBalance" />,
        key: 'TotalBalance',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'TotalBalance')
      },
      {
        title: <IntlMessages id="Wallet.AvailableBalance" />,
        key: 'AvailableBalance',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'AvailableBalance')
      },
      {
        title: <IntlMessages id="Wallet.InOrder" />,
        key: 'InOrder',
        width: 80,
        render: obj => renderCell(obj, 'NumberCell', 'InOrder')
      },
      {
        title: <IntlMessages id="Wallet.ConstantValue" />,
        key: 'ConstantValue',
        width: 100,
        render: obj => renderCell(obj, 'NumberCell', 'ConstantValue')
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

  handleWithdraw = async () => {
    const { wAmount, wAddress } = this.state;

    
    let result = await wallet.send(wAddress, wAmount);console.log(result);
    if(result){
      if(result.error){
        errorWithdraw(result.message);
      }
      else if(!result.Result){
        errorWithdraw(result.Message);
      }
      else{
        successWithdraw();
      }
    }
    
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
