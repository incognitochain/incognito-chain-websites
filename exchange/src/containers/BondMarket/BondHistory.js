import React, { Component } from 'react';
import axios from 'axios';
import Box from '@ui/utility/box';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import BreadcrumbBar from '@/containers/Breadcrumb/Breadcrumb';
import HistoryList from '@/containers/BondMarket/tableViews/HistoryList';
import BondList from '@/containers/BondMarket/tableViews/BondList';
import Input, {
    InputGroup,
  } from '@ui/uielements/input';
import { WithdrawWrapper, MessageContent }  from './tableViews/style';
import IntlMessages from '@ui/utility/intlMessages';
import Alert from "@ui/feedback/alert";
import Button from '@ui/uielements/button';

import ModalStyle from "./tableViews/modal.style";
import { Modal as Modals } from 'antd';
import WithDirection from "@/settings/withDirection";
import message from '@ui/feedback/message';

import bondmarket from '@/services/BondMarket';

import './BondHistory.scss';

const dataTest = {
    BondBuysHistory: {
        abddjflksjdflksdjflsdjflsdjfsdk: {
            TotalAmount: 100,
            BuyBackAvailable: 0,
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
        ksdjflkdsjflkdsjflsdkjflskdjflskdjf: {
            TotalAmount: 100,
            BuyBackAvailable: 0,
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



const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);

export default class BondHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bondList: [],
            data: {},
            selectedBondItem: null,
            isBuyBack: false,
            isValidate: true,
            clickedItem: null,
        }
    }
    componentDidMount() {
        this.getData();
        
    }

    async getData(){
        let result = await bondmarket.getHistoryList();
        //let result = dataTest;
        if(!result.error){
            const { BondBuysHistory = {} } = result;
            if(BondBuysHistory){
                const keys = Object.keys(BondBuysHistory); 
                const bonds = [];
                keys.forEach(key => {
                    let object = BondBuysHistory[key];
                    object.name = key;
                    bonds.push(object);
    
                });
                if(keys.length > 0) {
                    const firstKey = keys[0];
                    const selectedItem = BondBuysHistory[firstKey];
                    this.setState({
                        selectedBondItem: selectedItem
                    });
                }
              this.setState({bondList:bonds, data: BondBuysHistory});
            }
            
        }
        else{
          //return false;
        }
      }

    validate=({amount})=>{
    if (amount <=0) return false;
    return true;
    } 

    handleOnBondClick=(key)=> {
        const { data } = this.state;
        const selectedItem = data[key];
        this.setState({
            selectedBondItem: selectedItem
        });
    }
    handleBuyBack=(item)=> {
        this.setState({isBuyBack: true, clickedItem: item});
    }

    handleCancel = () => {
        this.setState({ isBuyBack: false});
      };

    handleOnBuyClick = async () => {
        const { wAmount, isValidate, clickedItem } = this.state;
        if(isValidate) {
            const params = {
            amount: wAmount,
            buyBondID: clickedItem.ID,
            };
            console.log('Params:', params);
            
            let result = await bondmarket.buyBack(params);
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
            
            this.setState({ isBuyBack: false });
        }  
    }
    changeAmount = (e) => {
        let val = e.target.value ? e.target.value : Number(e.target.value);
        this.setState({ wAmount:  val, isValidate: this.validate({amount:val})});
      }

    renderBondList() {
        const { bondList } = this.state;
        return (
            <div className="wrapperBondList">
                <Box title="Bond List">
                    <BondList list={bondList} onSelectBond={this.handleOnBondClick} />
                </Box> 
            </div>
        );
    }

    renderHistoryList() {
        const { selectedBondItem } = this.state;
        return (
            <div className="wrapperHistoryList">
                <Box title="Transaction">
                    {selectedBondItem && <HistoryList 
                        list={selectedBondItem.BondBuys}
                        onBuyBack={this.handleBuyBack}/>}
                </Box>
            </div>
        );
    }

    renderBuyModal(){
        const { isBuyBack, isValidate } = this.state;
        const title = <IntlMessages id="BondMarket.Buy" />;
    
        return (
          <Modal
              visible={isBuyBack}
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
                  onClick={this.handleOnBuyClick}
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
              </WithdrawWrapper>
              {!isValidate && <Alert
                message={
                  <IntlMessages id="BondMarket.BuyBack.WarningDescription" />
                }
                type="warning"
                style={{marginBottom: "10px"}}
              />}
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
    
        
        return (
          <BreadcrumbBar urls={urls}/>
        );
    
      }


    render(){
        return (
            <div className="">
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