import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Input, {InputGroup, Textarea} from '@ui/uielements/input';
import Portal from '../../services/portal'
import Button from '@ui/uielements/button';
import DatePicker from '@ui/uielements/datePicker'
import moment from 'moment'
import randomByte from 'random-bytes'

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
      loanAmount: 0,
      maturity: "",
      secretKey: "",
      collateralType: "ETH",
    };

  }

  componentDidMount() {
    Portal.getLoanParams().then((loanParams) => {
      this.setState({
        loanParams: loanParams,
        choosenLoanParam: loanParams[0],
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
    const maturityInSecond = maturity * (0.1 * 60) // 10 minutes for a new block // TODO
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

  ethCallSmartContract() {
    const {secretKey} = this.state
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
    } else {
      // Set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/03f57f19c3e1478fb38fb91a8f680550"));
    }
    var abiDefinition = JSON.parse('[{"constant":false,"inputs":[{"name":"newPrice","type":"uint256"}],"name":"updateCollateralPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"digest","type":"bytes32"},{"name":"stableCoinReceiver","type":"bytes"},{"name":"request","type":"uint256"},{"name":"offchain","type":"bytes32"}],"name":"sendCollateral","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"value","type":"uint256"},{"name":"percent","type":"uint256"}],"name":"part","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"collateralAmount","type":"uint256"},{"name":"debtAmount","type":"uint256"}],"name":"collateralRatio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"collateralPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"offchain","type":"bytes32"}],"name":"addPayment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"offchain","type":"bytes32"}],"name":"refundCollateral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"collateralAmount","type":"uint256"},{"name":"debtAmount","type":"uint256"}],"name":"safelyCollateralized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"offchain","type":"bytes32"}],"name":"liquidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"bytes32"}],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newPrice","type":"uint256"}],"name":"updateAssetPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"bytes32"},{"name":"value","type":"uint256"},{"name":"offchain","type":"bytes32"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"loans","outputs":[{"name":"state","type":"uint8"},{"name":"borrower","type":"address"},{"name":"digest","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"request","type":"uint256"},{"name":"principle","type":"uint256"},{"name":"interest","type":"uint256"},{"name":"maturityDate","type":"uint256"},{"name":"escrowDeadline","type":"uint256"},{"name":"stableCoinReceiver","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assetPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"offchain","type":"bytes32"}],"name":"rejectLoan","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"params","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"lid","type":"bytes32"},{"name":"key","type":"bytes32"},{"name":"offchain","type":"bytes32"}],"name":"acceptLoan","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_lender","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__sendCollateral","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"key","type":"bytes32"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__acceptLoan","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__rejectLoan","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__refundCollateral","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__addPayment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lid","type":"bytes32"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"commission","type":"uint256"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__liquidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"offchain","type":"bytes32"}],"name":"__update","type":"event"}]')
    var loanContract = web3.eth.contract(abiDefinition)
    var contractInstance = loanContract.at(process.env.loanSmartContractAddress);
    var constantPaymentAddress = web3.fromAscii("1Uv3jP4ixNx3BkEtmUUxKXA1TXUduix3KMCWXHvLqVyA9CFfoLRZ949zTBNqDUPSzaPCZPrQKSfiEHguFazK6VeDmEk1RMLfX1kQiSqJ6")
    var digestKey = web3.fromAscii(secretKey)
    var lid = "0x0"
    var offChain = randomBytes.sync(1)
    contractInstance.sendCollateral(lid, digestKey, constantPaymentAddress, this.state.loanAmount * 100, offChain,
      {from: web3.eth.accounts[0]},
      function (a) {
        if (a !== undefined) {
          if (a.name == "Error") {
            return false;
          } else {
            return true
          }
        }
      });
  }

  submitLoanRequest() {
    const loanID = 1 + ""
    const keyDigest = "";

    // call web 3 for eth
    switch (this.state.collateralType) {
      case "ETH":
        this.ethCallSmartContract();
        return
        break;
      default:
        alert("Wrong Collateral type")
    }

    const startDate = moment().format("YYYY-MM-DD")
    const endDate = moment(this.state.maturity, "DD-MM-YYYY").format("YYYY-MM-DD")
    // const endDate = this.timeConverter((Date.parse(this.state.maturity)))
    const params = this.state.choosenLoanParam
    const colType = this.state.collateralType
    const colAmount = this.state.collateralAmount + ""
    const loanAmount = this.state.loanAmount * 100 // format nano constant
    Portal.createLoanRequest(startDate, endDate, params, loanID, colType, colAmount, loanAmount, keyDigest).then((result) => {
      debugger
    })
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

  changeLoanAmount = (event) => {
    const val = event.target.value
    const {choosenLoanParam} = this.state
    const LiquidationStart = choosenLoanParam.LiquidationStart
    if (LiquidationStart !== undefined) {
      var oracleRate = {'ETH': 118, 'BTC': 3674};
      var fix = {'ETH': 2, 'BTC': 10}
      const collateralType = this.state.collateralType
      var rate = oracleRate[collateralType];
      var collateralAmount = ((parseInt(val) / rate) * (LiquidationStart / 10000)).toFixed(fix[collateralType]);
      this.setState({
        collateralAmount: collateralAmount,
        loanAmount: parseInt(val),
      });
    }
  }

  changeSecretKey = (event) => {
    const secretKey = event.target.value
    this.setState({
      secretKey: secretKey,
    })
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
    const {loanParams, collateralAmount, maturity, collateralType, secretKey} = this.state;
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
                    <Input onChange={this.changeLoanAmount} type="number"></Input>
                  </div>
                  <div className="col-12 col-md-4">
                    <h3>COLLATERAL AMOUNT</h3>
                    <Input disabled={true} type="number" value={collateralAmount}></Input>{collateralType}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <label>
                      Secret Key
                      <Input type="password" value={secretKey} onChange={this.changeSecretKey}/>
                    </label>
                  </div>
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
                <Button className="c-btn c-btn-primary" onClick={() => this.submitLoanRequest()}>Summit</Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default ComponentName;
