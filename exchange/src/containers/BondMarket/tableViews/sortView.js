import React, { Component } from 'react';
import ContentHolder from '@ui/utility/contentHolder';
import ModalStyle from "./modal.style";
import TableWrapper , { WithdrawWrapper, MessageContent }  from './style';
import { Modal as Modals } from 'antd';
import WithDirection from "@/settings/withDirection";
import Button from "@ui/uielements/button";
import IntlMessages from '@ui/utility/intlMessages';
import Alert from "@ui/feedback/alert";
import message from '@ui/feedback/message';
import Input, {
  InputGroup,
} from '@ui/uielements/input';
import bondmarket from '@/services/BondMarket';
import { nanoToConstant } from '@/helpers/utility';

import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from '@ui/tables/helperCells';

const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);


const successBuy = () => {
  const msg = "Buy success!"//<IntlMessages id="Wallet.SymbolCode" />;
  message.success(
    <MessageContent>
      {msg}
    </MessageContent>,
    2
  );
};

const errorBuy = (msg) => {
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
      isBuy: false,
      wAmount: 0,
      wRate: 0,
      dataList: this.props.dataList.getAll(),
      loading: false,
      isValidate: true,
      selectedItem: null,
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
        render: obj => {
          return <span>{nanoToConstant(obj.BuyBackPrice).toLocaleString()} CONST</span>
        }
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
        render: obj => <span>{nanoToConstant(obj.Rate).toLocaleString()}</span>
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
  validate=({amount, rate})=>{
    if (amount <=0) return false;
    if (rate <=0) return false;
    return true;
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

  onBuy(obj) {
    this.setState({ isBuy: true, selectedItem: obj});
    
  }

  changeAmount = (e) => {
    let val = e.target.value ? e.target.value : Number(e.target.value);
    this.setState({ wAmount:  val});
  }

  changeRate = (e) => {
    let val = e.target.value ? e.target.value : Number(e.target.value);
    this.setState({ wRate:  val});
  }

  handleCancel = () => {
    this.setState({ isBuy: false});
  };

  handleBuy = async () => {
    const { wAmount, wRate, selectedItem } = this.state;
    const isValidate = this.validate({amount: wAmount, rate: wRate})
    if(isValidate) {
      const params = {
        amount: wAmount,
        bondID: selectedItem.BondID,
        rate: wRate
      };
      let result = await bondmarket.buy(params);
      if(result){
        if(result.error){
          errorBuy(result.message);
        }
        else if(!result.Result){
          errorBuy(result.Message);
        }
        else{
          successBuy();
        }
      }
      this.setState({ isBuy: false, isValidate });
    }else {
      this.setState({ isValidate});
    }   
  }



  renderBuy(){
    const { isBuy, isValidate } = this.state;
    const title = <IntlMessages id="BondMarket.Buy" />;

    return (
      <Modal
          visible={isBuy}
          title={title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>
              <IntlMessages id="BondMarket.Buy.Cancel" />
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              loading={this.state.loading}
              onClick={this.handleBuy}
            >
              <IntlMessages id="BondMarket.Buy.Submit" />
            </Button>
          ]}
        >
          <WithdrawWrapper>
            <div><IntlMessages id="BondMarket.Buy.Amount" /></div>
            <InputGroup >
              <Input
                addonAfter="BOND"
                placeholder="0.00"
                onChange={(e) => this.changeAmount(e)}
              />
            </InputGroup>
            <div><IntlMessages id="BondMarket.Rate" /></div>
            <InputGroup >
              <Input
                //addonAfter="BOND"
                placeholder="0.00"
                onChange={(e) => this.changeRate(e)}
              />
            </InputGroup>
            
          </WithdrawWrapper>
          {!isValidate && <Alert
            message={
              <IntlMessages id="BondMarket.Buy.WarningDescription" />
            }
            type="warning"
            style={{marginBottom: "10px"}}
          />}
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
          this.renderBuy()
        }
      </ContentHolder>
    );
  }
}
