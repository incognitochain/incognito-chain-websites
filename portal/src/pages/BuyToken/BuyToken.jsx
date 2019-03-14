import React from 'react';
import { connect } from 'react-redux';
import { detect } from 'detect-browser';

import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

// import { detectInstalled, requestUnlockMetamask, init } from '@/reducers/metamask/action';
import Web3js from 'web3';

import abiDefinition from './abiDefinition';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import Link from '@/components/Link';
// import Logo from '@/assets/logo.svg';
import bgImage from '@/assets/create-a-proposal.svg';

import {BUYING_ASSET} from '../../constants';
import { buyAsset, buyTokenByEthereum } from "../../services/reserveAsset";

const BUYING_OBJECT = {
  USD: "usd",
  ETH: "eth",
}

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
    };
  }

  onAssetChange = (asset) => {
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
    const {asset, amount} = this.state;
    const {auth={}} = this.props;
    const {data={}} = auth;
    const {PaymentAddress} = data;
    if (!PaymentAddress) return;

    if (!asset || isNaN(amount) || amount <= 0) {
      return;
    }

    let resultMessage = "Get TOKEN Successful";
    this.setState({isSummitting: true});
    if (asset === BUYING_OBJECT.USD) {
      const result = await buyAsset(BUYING_ASSET.DCB_TOKEN, amount*100);
      const {error=""} = result;
      // console.log(result);
      if (error) {
        resultMessage = error;
      }
      this.setState({resultMessage, openDialog: true})
    } else if (asset === BUYING_OBJECT.ETH) {
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
    const {asset = "", amount = "", isSummitting, openDialog, openMetamaskDialog } = this.state;
    const disableSubmitBtn = (asset === "" || isSummitting);
    return (
      <div className="buytoken-page">
        <div className="container">
          <h5>Reserve Assets</h5>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-8">
              <div className="c-card">
                <FormControl component="fieldset" style={{width: "100%"}} >
                  <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    // className={classes.group}
                    value={asset}
                    onChange={(e)=>this.onAssetChange(e.target.value)}
                    style={{display: 'flex', flexDirection: 'row'}}
                  >
                    <FormControlLabel value={BUYING_OBJECT.USD} control={<Radio />} label="USD" />
                    <FormControlLabel
                      control={<Radio />}
                      label="ETH"
                      value={BUYING_OBJECT.ETH}
                    />
                  </RadioGroup>

                  <TextField
                    id="standard-full-width"
                    // label="Label"
                    type="number"
                    style={{ margin: 8 }}
                    placeholder="Amount"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                      <Button variant="contained" style={{width: "100%"}} onClick={this.onSubmit} disabled={disableSubmitBtn}>
                        Get DCB Token
                      </Button>
                  }

                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 150 }}>
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyToken);
