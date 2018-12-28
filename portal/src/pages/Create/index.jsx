import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Input, {InputGroup, Textarea} from '@ui/uielements/input';
import Portal from '../../services/portal'
import Button from '@ui/uielements/button';
import DatePicker from '@ui/uielements/datePicker'

class ComponentName extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      loanParams: false,
      choosenLoanParam: {},
      collateralAmount: 0.0,
      maturity: "",
      collateralType: "ETH",
    };

  }

  componentDidMount() {
    Portal.getLoanParams().then((loanParams) => {
      this.setState({
        loanParams: loanParams,
      });
    })
  }

  componentWillMount() {

  }

  chooseCollateralType(type) {
    this.setState({
      collateralType: type,
    })
  }

  chooseInterestRate(loanParam) {
    const maturity = loanParam.Maturity // in block time
    const maturityInSecond = maturity * (10 * 160) // 10 minutes for a new block // TODO
    var now = new Date()
    var nowInSecond = (now / 1000 | 0)
    nowInSecond += (maturityInSecond - 3600)

    var maturityDate = this.timeConverter(nowInSecond)

    this.setState({
      choosenLoanParam: loanParam,
      maturity: maturityDate,
    });
    console.log("chosen loan param");
    console.log(loanParam);
  }

  timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    if (date < 10) {
      date = "0" + date
    }
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '-' + month + '-' + year// + '-' + hour + ':' + min + ':' + sec;
    return time;
  }

  changeLoanAmount(self, event) {
    const val = event.target.value
    const {choosenLoanParam} = self.state
    const LiquidationStart = choosenLoanParam.LiquidationStart
    if (LiquidationStart !== undefined) {
      var oracleRate = {'ETH': 118, 'BTC': 3674};
      var fix = {'ETH': 2, 'BTC': 10}
      const collateralType = self.state.collateralType
      var rate = oracleRate[collateralType];
      debugger
      var collateralAmount = ((parseInt(val) / rate) * (LiquidationStart / 10000)).toFixed(fix[collateralType]);
      this.setState({
        collateralAmount: collateralAmount,
      });
    }
  }

  renderCollateralType() {
    return (
      <div>
        <Button onClick={() => {
          this.chooseCollateralType("ETH")
        }}>
          ETH
        </Button>
        <Button disabled={true} onClick={() => {
          this.chooseCollateralType("BTC")
        }}>
          BTC
        </Button>
      </div>
    )
  }

  renderInterestRates(loanParams) {
    if (loanParams !== undefined && loanParams != false) {
      var indents = loanParams.map((value, i) => {
        return (
          <Button type="" className="interest" onClick={() => {
            this.chooseInterestRate(value)
          }}>
            {(value.InterestRate / 100)} %
          </Button>
        );
      });
      return (
        indents
      )
    }
    return (
      <div></div>
    );
  }

  render() {
    const {loanParams, collateralAmount, maturity, collateralType} = this.state;
    return (
      <div className="create">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="create-hero">
                <h2>Constant loans backed by your crypto assets</h2>
                <p>Use your crypto to get Constant without selling</p>
              </div>
            </div>
            <div className="col-12">
              <div className="create-box">
                <h2>Create a loan request</h2>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <h3>CHOOSE YOUR COLLATERAL</h3>
                    {this.renderCollateralType()}
                  </div>
                  <div className="col-12 col-md-4">
                    <h3>ENTER LOAN AMOUNT</h3>
                    <Input onChange={(event) => this.changeLoanAmount(this, event)} type="number"></Input>
                  </div>
                  <div className="col-12 col-md-4">
                    <h3>COLLATERAL AMOUNT</h3>
                    <Input disabled={true} type="number" value={collateralAmount}></Input>{collateralType}
                  </div>
                </div>
                <div className="row">
                  {/*<div className="col-12 col-md-4">
                    <label>
                      START DATE
                      <DatePicker onChan/>
                    </label>
                  </div>*/}
                  <div className="col-12 col-md-4">
                    <label>
                      Maturity
                      <Input disabled={true} value={maturity}></Input>
                    </label>
                  </div>
                  <div className="col-12 col-md-4">
                    <label>
                      INTEREST RATE
                      {this.renderInterestRates(loanParams)}
                    </label>
                  </div>
                </div>
                <p>
                  I certify that I am 18 years of age or older,
                  and I agree to the Terms & Conditions.
                </p>
                <button className="c-btn c-btn-primary" type="button">Summit</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default ComponentName;
