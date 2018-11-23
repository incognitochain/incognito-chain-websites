import React, { Component } from 'react';
import IntlMessages from '../../../components/utility/intlMessages';
import { RadioGroup, RadioButton } from '../../../components/uielements/radio';
import Button, { ButtonGroup } from '../../../components/uielements/button';
import ContentHolder from '../../../components/utility/contentHolder';
import Tabs, { TabPane } from '../../../components/uielements/tabs';
import Input, {
  InputSearch,
  InputGroup,
  Textarea
} from '../../../components/uielements/input';
import { OrderSide, Label, OrderForm, OrderFormFooter } from './style'; 
function callback(key) {}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      side: 'buy',
      fee: 0,
      total: 0,
    }
    
  }

  changeSide = e => {
    console.log(e.target.value3)
    this.setState({ side: e.target.value });
  };

  render() {
    const { side, fee, total } = this.state;
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
        <Tabs defaultActiveKey="1" onChange={callback} size="small">
          <TabPane tab="Market" key="1">
            <Label><IntlMessages id="Exchange.OrderForm.Amount" /></Label>
            <InputGroup >
              <Input
                addonAfter="CONST"
                placeholder="0.00"
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
            <Button type={btnType} size="large" style={{width: '100%', marginTop: '1rem'}}>
              {btnText}
            </Button>
          </TabPane>
          <TabPane tab="Limit" key="2">
            <Label><IntlMessages id="Exchange.OrderForm.Amount" /></Label>
            <InputGroup >
              <Input
                addonAfter="CONST"
                placeholder="0.00"
              />
            </InputGroup>

            <Label><IntlMessages id="Exchange.OrderForm.Price" /></Label>
            <InputGroup >
              <Input
                addonAfter="USD"
                placeholder="0.00"
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
            <Button type={btnType} size="large" style={{width: '100%', marginTop: '1rem'}}>
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
