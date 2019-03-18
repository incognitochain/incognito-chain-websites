import React from 'react';
import { connect } from 'react-redux';
import { detect } from 'detect-browser';
import dayjs from 'dayjs';

import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  // Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  InputLabel,
} from '@material-ui/core';

// import { detectInstalled, requestUnlockMetamask, init } from '@/reducers/metamask/action';
import Web3js from 'web3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faSpinnerThird, faUsdCircle, faUsdSquare } from '@fortawesome/pro-light-svg-icons';
// import Link from '@/components/Link';
// import Logo from '@/assets/logo.svg';
import bgImage from '@/assets/create-a-proposal.svg';
import abiDefinition from './abiDefinition';

import {BUYING_ASSET} from '../../constants';
import { buyAsset, buyTokenByEthereum, getHistory, getReserveStatistic } from "../../services/reserveAsset";

const BUYING_OBJECT = {
  USD: "usd",
  ETH: "eth",
}

const collaterals = [
  { name: 'USD', icon: faUsdCircle, value: "usd" },
  { name: 'ETH', icon: faEthereum, value: "eth" },
];

const isMetamaskInstalled = typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask;

const mapStateToProps = (state) => {
  return {
    metamask: state.metamask,
    auth: state.auth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // metamaskInit: init,
    // metamaskDetectInstalled: detectInstalled,
  }
}

class BuyToken extends React.Component {
  constructor(props) {
    super(props);

    let openMetamaskDialog = false;
    if (!isMetamaskInstalled) {
      // alert("metamask  installed");
      openMetamaskDialog = true;
    }

    this.state = {
      isSummitting: false,
      openDialog: false,
      openMetamaskDialog,
      resultMessage: "",
      history: [],
      allStats: {},
      page:1,
      perPage: 10,
      asset: collaterals[0],
    };
  }
  componentDidMount() {
    this.onGetHistory();
    this.onGetStats();
  }

  onAssetChange = (asset) => {
    // console.log(asset);
      this.setState({
        asset,
      });
  }
  onAmountChange = (amount) => {
      this.setState({
        amount,
      });
  }

  onSubmit = async () => {
    const {asset={}, amount} = this.state;
    const {auth={}} = this.props;
    const {data={}} = auth;
    const {PaymentAddress} = data;
    if (!PaymentAddress) return;

    if (!asset || isNaN(amount) || amount <= 0) {
      return;
    }

    let resultMessage = "Get TOKEN Successful";
    this.setState({isSummitting: true});
    if (asset.value === BUYING_OBJECT.USD) {
      const result = await buyAsset(BUYING_ASSET.DCB_TOKEN, amount*100);
      const {error=""} = result;
      // console.log(result);
      if (error) {
        resultMessage = error;
      }
      this.setState({resultMessage, openDialog: true})
    } else if (asset.value === BUYING_OBJECT.ETH) {
      if (!isMetamaskInstalled) {
        this.setState({openMetamaskDialog: true, isSummitting: false});
        return;
      }
      const buyResult = await buyTokenByEthereum(parseInt(amount));
      const {error="", result} = buyResult;
      const {ID} = result;
      console.log(result);
      if (error) {
        resultMessage = error;
        this.setState({resultMessage, openDialog:true, isSummitting: false})
        return;
      } else {
        let web3App;
        if (isMetamaskInstalled){
          web3App = new Web3js(web3.currentProvider);
        } else {
          web3App = new Web3js(new Web3js.providers.HttpProvider("https://rinkeby.infura.io/v3/03f57f19c3e1478fb38fb91a8f680550"));
        }
        const accounts = await web3App.eth.getAccounts() || [];
        if (accounts.length <= 0) {
          this.setState({resultMessage: "Something wrong :(, please check your metamask account", openDialog:true, isSummitting: false})
          return
        }
        // const coinReceiver = accounts[0].toString();
        const offchain = web3App.utils.fromAscii(`E2D_${ID}`);
        const coinReceiver = web3App.utils.fromAscii(PaymentAddress);

        try {
          await this.onETHRaiseHandle(coinReceiver, offchain, amount, web3App, accounts[0])
        } catch (error) {
          console.log(error);
          this.setState({openDialog: true, resultMessage: error.message});
        }
      }
    }
    this.setState({isSummitting: false});
  }
  onCloseDialog = () => {
    this.setState({openDialog:false, resultMessage: ""});
  }
  onCloseInstallMetamaskDialog = () => {
    this.setState({openMetamaskDialog:false});
  }

  onETHRaiseHandle = async (coinReceiver, offchain, amount, web3App, fromAddr) => {

    const contractInstance = new web3App.eth.Contract(abiDefinition, process.env.reserveSmartContractAddress);
    try {
      contractInstance.methods.raise(coinReceiver, offchain).send({
        from: fromAddr,
        value: parseFloat(amount) * (10 ** 18),
      })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', (receipt) => {
        console.log('OK')
      })
      .on('err', (err) => {
        console.log(err);
        // error
      })
      .catch((e) => {
        console.log(e);
      });
    } catch (error) {
      throw error;
    }
  }

  onGetHistory = async () => {
    const {page, perPage} = this.state;
    const res = await getHistory(BUYING_ASSET.DCB_TOKEN, perPage, page);
    // console.log(res)
    const {result = [], error=""} = res;
    if (error) {
      console.log("get history error", error);
      return;
    }
    this.setState({ history: result });
  }

  onGetStats = async () => {
    const res = await getReserveStatistic();
    // console.log(res)
    const {result = {}, error=""} = res;
    if (error) {
      console.log("get stats error", error);
      return;
    }
    this.setState({ allStats: result });
  }

  linkMetamask = () => {
    const browser = detect();
    switch (browser && browser.name) {
      case 'chrome':
        return (<a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank" rel="noopener noreferrer">get Chrome extension</a>);
      case 'firefox':
        return (<a href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" target="_blank" rel="noopener noreferrer">get Firefox extension</a>);
      default:
        return 'Please use brower based on Chrome, Firefox or Brave';
    }
  }

  render = () => {
    const {asset = {}, amount = "", isSummitting, openDialog, openMetamaskDialog, history = [], allStats = {} } = this.state;
    const disableSubmitBtn = (asset === "" || isSummitting);
    return (
      <div className="home-page">
        <section >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-8">
              <div className="c-card">
                <div className="hello">
                  Reserve Assets
                </div>
                <div className="row stats-container" style={{display: "flex", justifyContent: "center"}}>
                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      {allStats.TotalReservesSuccess || 0}
                      &nbsp;
                      <sup>Reserve</sup>
                    </div>
                    <div>Success</div>
                  </div>
                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      {allStats.TotalReservesFailed || 0}
                      &nbsp;
                      <sup>Reserve</sup>
                    </div>
                    <div>Failed</div>
                  </div>
                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      {allStats.TotalReservesProcessing || 0}
                      &nbsp;
                      <sup>Reserve</sup>
                    </div>
                    <div>Processing</div>
                  </div>
                </div>
              </div>

              <div className="create-box c-card">
                <div className="title">CHOOSE YOUR OPTION</div>
                <div className="input" style={{ display:"flex",  paddingTop:5, paddingBottom:5 }}>
                  {collaterals.map(collateral => (
                    <div
                      key={collateral.name}
                      className={`collateral-option ${asset.name === collateral.name ? 'active' : ''}`}
                      onClick={() => this.onAssetChange(collateral)}
                      style={{
                        cursor: "pointer",
                        height: 70,
                        width: 70,
                        backgroundColor: asset.name === collateral.name ? '#FFFFFF' : "#FAFAFA" ,
                        display: "flex",
                        border: "1px solid #E4E7F2",
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems:"center",
                        marginRight: 10,
                      }}
                    >
                      <FontAwesomeIcon icon={collateral.icon} size="2x" />
                    </div>
                  ))}
                </div>
                <br/>

                <FormControl component="fieldset" style={{width: "100%"}} >
                  <InputLabel htmlFor="amount" shrink style={{fontSize: 20}}>Amount</InputLabel>
                  <TextField
                    id="amount"
                    // label="Amount"
                    type="number"
                    // style={{ marginTop: 8 }}
                    // placeholder="Amount"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      style: {marginTop: 10, marginBottom: 10},
                    }}
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    onChange={(e)=>this.onAmountChange(e.target.value)}
                    value={amount}
                  />
                  <br/>
                  {
                    isSummitting ?
                      <div style={{display: "flex", justifyContent:"center"}}>
                        <CircularProgress style={{width: "auto", height:"auto"}} />
                      </div>
                    :
                      <button className="c-btn c-btn-primary submit"  style={{width: "100%"}} onClick={this.onSubmit} disabled={disableSubmitBtn}>
                        Get DCB Token
                        &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                      </button>
                  }
                </FormControl>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 225, backgroundSize: "100%" }}>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={openDialog}
          onClose={this.onCloseDialog}
          aria-labelledby="result-dialog-label"
          aria-describedby="result-dialog-description"
        >
          <DialogContent>
            <DialogContentText>
              {this.state.resultMessage}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openMetamaskDialog}
          onClose={this.onCloseInstallMetamaskDialog}
          aria-labelledby="install-metamask-dialog-title"
          aria-describedby="install-metamask-dialog-description"
        >
          <DialogContent>
            <DialogContentText>
              You need to install Metamask (
              {this.linkMetamask()}
              ) or import your Ethereum Private Key to continue.
            </DialogContentText>
          </DialogContent>
        </Dialog>

        </section>

        <div className="borrows-container" style={{ display: 'block' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-card c-card-no-padding">
                <table className="c-table-portal-home">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                        history.map((item={}) => {
                          return (
                            <tr key={`history-${item.ID}`} >
                              <td>{item.ID}</td>
                              <td>{item.Amount}</td>
                              <td>{item.Status}</td>
                              <td>{dayjs(item.CreatedAt).format('MM-DD-YYYY')}</td>
                            </tr>
                          )
                        })
                      }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyToken);

// <RadioGroup
//   aria-label="Gender"
//   name="gender1"
//   // className={classes.group}
//   value={asset}
//   onChange={(e)=>this.onAssetChange(e.target.value)}
//   style={{display: 'flex', flexDirection: 'row'}}
// >
//   <FormControlLabel value={BUYING_OBJECT.USD} control={<Radio />} label="USD" />
//   <FormControlLabel
//     control={<Radio />}
//     label="ETH"
//     value={BUYING_OBJECT.ETH}
//   />
// </RadioGroup>
