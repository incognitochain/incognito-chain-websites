import React, { Component } from 'react';
import IntlMessages from '@/components/utility/intlMessages';
import { RadioGroup, RadioButton } from '@/components/uielements/radio';
import Button, { ButtonGroup } from '@/components/uielements/button';
import ContentHolder from '@/components/utility/contentHolder';
import message from "@/components/feedback/message";
import Tabs, { TabPane } from '@/components/uielements/tabs';
import Input, {
  InputSearch,
  InputGroup,
  Textarea
} from '@/components/uielements/input';
import { OrderSide, Label, OrderForm, OrderFormFooter, MessageContent } from './style'; 
import exchange from '@/services/Exchange';

const showMessage = (msg, type='warning', time=2) => {

  if(type == 'success'){
    message.success(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
  else if(type == 'error'){
    message.error(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
  else{
    message.warning(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      side: 'buy',
      fee: 0,
      total: 0,
      amount: '',
      price: '',
      loading: false,
      type: 'market',
      symbolCode: props.symbolCode,
      coinBase: props.coinBase,
      coinUsing: props.coinUsing,
    }
  }

  componentWillReceiveProps(){
    const { symbolCode, coinBase, coinUsing } = this.props;
    if(!this.state.symbolCode || !this.state.coinBase || !this.state.coinUsing)
      this.setState({symbolCode, coinBase, coinUsing});
  }

  changeSide = e => {
    this.setState({ side: e.target.value });
  };

  changeAmount = (e) => {
    let val = e.target.value ? e.target.value : Number(e.target.value);
    this.setState({ amount:  val});
  }

  changePrice = (e) => {
    this.setState({ price: e.target.value });
  }

  changeTab = (key) => {
    this.setState({type: key === 1 ? 'market' : 'limit'});
  }

  handleOrder = async () => {
    const { amount, price, side, type, symbolCode } = this.state;
    if(!amount){
      showMessage('Please enter amount');
      return;
    }
    
    if(!price && type == 'limit'){
      showMessage('Please enter price');
      return;
    }


    const result = await exchange.CreateOrder(symbolCode, Number(price), Number(amount), type, side);
    if(result){
      if(result.error){
        showMessage(result.message, 'error');
      }
      else if(result.Error){
        showMessage(result.Message, 'error');
      }
      else{
        showMessage("Place order success", 'success');
        this.onFinish();
      }
    }
    
    //this.setState({ isDeposit: false, isWithdraw: false, });
  }

  onFinish = () => {
    const { onFinish } = this.props;
    
    if (onFinish) {
      onFinish();
    }
  }

  render() {
    const { side, fee, total, price, amount, loading, coinBase, coinUsing, symbolCode } = this.state;
    const btnText = side == "buy" ? <IntlMessages id="Exchange.OrderForm.PlaceOrderBuy" /> : <IntlMessages id="Exchange.OrderForm.PlaceOrderSell" />;
    const btnType = side == "buy" ? "success" : "danger";
    return (
      <OrderForm>
      <ContentHolder>
        <RadioGroup value={this.state.side} onChange={this.changeSide} style={{width:'100%'}}>
          <RadioButton value="buy" style={this.state.side == 'buy' ? OrderSide.Buy : OrderSide.Default}>BUY</RadioButton>
          <RadioButton value="sell" style={this.state.side == 'sell' ? OrderSide.Sell : OrderSide.Default}>SELL</RadioButton>
        </RadioGroup>
      </ContentHolder>
      <ContentHolder style={{marginTop: '1rem'}}>
        <Tabs defaultActiveKey="1" onChange={(key) => this.changeTab(key)} size="small">
          <TabPane tab="Market" key="1">
            <Label><IntlMessages id="Exchange.OrderForm.Amount" /></Label>
            <InputGroup >
              <Input
                addonAfter={coinUsing.toUpperCase()}
                placeholder="0.00"
                onChange={(e) => this.changeAmount(e)}
                value={amount}
              />
            </InputGroup>
            <OrderFormFooter>
              <div>
                <span>Fee</span>
                <span>{fee}</span>
              </div>
              <div>
                <span>Total</span>
                <span>{total}</span>
              </div>
            </OrderFormFooter>
            <Button type={btnType} size="large" style={{width: '100%', marginTop: '1rem'}}
              loading={loading}
              onClick={this.handleOrder}
            >
              {btnText}
            </Button>
          </TabPane>
          <TabPane tab="Limit" key="2">
            <Label><IntlMessages id="Exchange.OrderForm.Amount" /></Label>
            <InputGroup >
              <Input
                addonAfter={coinUsing.toUpperCase()}
                placeholder="0.00"
                onChange={(e) => this.changeAmount(e)}
                value={amount}
              />
            </InputGroup>

            <Label><IntlMessages id="Exchange.OrderForm.Price" /></Label>
            <InputGroup >
              <Input
                addonAfter={coinBase.toUpperCase()}
                placeholder="0.00"
                onChange={(e) => this.changePrice(e)}
                value={price}
              />
            </InputGroup>
            <OrderFormFooter>
              <div>
                <span>Fee</span>
                <span>{fee}</span>
              </div>
              <div>
                <span>Total</span>
                <span>{total}</span>
              </div>
            </OrderFormFooter>
            <Button type={btnType} size="large" style={{width: '100%', marginTop: '1rem'}}
              loading={loading}
              onClick={this.handleOrder}
            >
              {btnText}
            </Button>
          </TabPane>
        </Tabs>
      </ContentHolder>
      <ContentHolder>
        
      </ContentHolder>  
      </OrderForm>
    );
  }
}
