import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { detect } from 'detect-browser';
import {
  Formik, Form, Field,
} from 'formik';
import dayjs from 'dayjs';
import {
  TextField,
  FormControl,
  // Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  TablePagination,
  Tabs,
  Tab,
} from '@material-ui/core';
import Web3js from 'web3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faUsdCircle } from '@fortawesome/pro-light-svg-icons';
import bgImage from '@/assets/create-a-proposal.png';
import { debounce } from 'lodash';
import abiDefinition from './abiDefinition';
import ErrorMessage from '../../components/formik/ErrorMessage';

import { BUYING_ASSET, RESERVE_HISTORY_STATUS_COLOR } from '../../constants';
import {
  buyAsset, buyTokenByEthereum, getHistory, getETHHistory, getPurchaseStatistic, getRaiseReserveInfo, convertETHtoDCBToken, convertUSDtoDCBToken
} from '../../services/reserveAsset';

const BUYING_OBJECT = {
  USD: "usd",
  ETH: "eth",
};

const collaterals = [
  { name: 'USD', icon: faUsdCircle, value: BUYING_OBJECT.USD },
  { name: 'ETH', icon: faEthereum, value: BUYING_OBJECT.ETH },
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
      historyPagination: {Page: 1, Limit: 10, TotalRecord: 0, TotalPage:0},
      ETHhistory: [],
      ETHhistoryPagination: {Page: 1, Limit: 10, TotalRecord: 0, TotalPage:0},
      purchaseStats: {},
      asset: collaterals[0],
      reserveInfo: {},
      convertToToken: 0,
      tabIndex: 0,
      isDCBConverting: false,
      isGettingReserveInfo: false,
    };

    // bind
    this.onConvertAmountToDCBToken = debounce(this.onConvertAmountToDCBToken.bind(this), 500);
  }

  componentDidMount() {
    this.onGetStats();
    this.getReserveInfo();
    this.onGetHistory();
    this.onGetETHHistory();
  }

  onAssetChange = (asset) => {
    // console.log(asset);
    this.setState({
      asset,
      isDCBConverting: true,
    }, this.onConvertAmountToDCBToken);
  }

  onAmountChange = (e) => {
    const amount = (e && e.target && e.target.value) || 0;
    this.setState({
      amount,
      isDCBConverting: true,
    }, this.onConvertAmountToDCBToken);
  }

  onSubmit = async () => {
    const {asset={}, amount, reserveInfo={}, convertToToken} = this.state;
    const {auth={}} = this.props;
    const {data={}} = auth;
    const {PaymentAddress} = data;
    if (!PaymentAddress) return;

    if (!asset || isNaN(amount) || amount <= 0) {
      return;
    }
    if (convertToToken > reserveInfo.LeftToken) {
      this.setState({resultMessage: "Current amount of Token is not enough", openDialog:true});
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

  onGetHistory = async (perPage, page) => {
    const res = await getHistory(BUYING_ASSET.DCB_TOKEN, perPage, page);
    // console.log(res)
    const {result = [], error=""} = res;
    if (error) {
      console.log("get history error", error);
      return;
    }
    let { Records = [], ...pagination } = result;
    if (Records === null) Records = [];
    this.setState({ history: Records, historyPagination: pagination });
  }
  onGetETHHistory = async (perPage, page) => {
    const res = await getETHHistory(perPage, page);
    // console.log(res)
    const {result = [], error=""} = res;
    if (error) {
      console.log("get history error", error);
      return;
    }
    let { Records = [], ...pagination } = result;
    if (Records === null) Records = [];
    this.setState({ ETHhistory: Records, ETHhistoryPagination: pagination });
  }

  onGetStats = async () => {
    const res = await getPurchaseStatistic();
    // console.log(res)
    const {result = {}, error=""} = res;
    if (error) {
      console.log("get stats error", error);
      return;
    }
    this.setState({ purchaseStats: result });
  }

  getReserveInfo = async () => {
    try {
      this.setState({ isGettingReserveInfo: true });
      const res = await getRaiseReserveInfo();
      const { result = {}, error = '' } = res;
      if (error) {
        console.log("get stats error", error);
        return;
      }
      this.setState({ reserveInfo: result });
    } catch (e) {
      this.setState({ resultMessage: 'Error occurs while getting reserve info.' });
    } finally {
      this.setState({ isGettingReserveInfo: false });
    }
    
  }

  onConvertAmountToDCBToken = async () => {
    try {
      this.setState({ isDCBConverting: true });
      let { amount, asset = {} } = this.state;
      if (!amount || typeof amount === undefined) {
        amount = 0;
      }
      amount = parseFloat(amount);
      let res = {};
      if (asset.value === BUYING_OBJECT.ETH) {
        res = await convertETHtoDCBToken(amount);
      }
      if (asset.value === BUYING_OBJECT.USD) {
        res = await convertUSDtoDCBToken(amount*100);
        console.log(res);
      }
  
      const {result, error=""} = res;
      if (error) {
        console.log("convert amount to token error", error);
        this.setState({ convertToToken: 0 });
      } else {
        this.setState({ convertToToken: result });
      }
    } catch (e) {
      this.setState({ resultMessage: 'Error occurs while converting to DCB token, please try again.' });
    } finally {
      this.setState({ isDCBConverting: false });
    }
  }

  onChangeHistoryPage = (page) => {
    const {historyPagination} = this.state;
    const {Limit=10} = historyPagination;
    this.onGetHistory(Limit, page+1);
  }
  onChangeHistoryRowsPerPage = (perPage) => {
    this.onGetHistory(perPage, 1);
  }
  onChangeETHHistoryPage = (page) => {
    const {ETHhistoryPagination} = this.state;
    const {Limit=10} = ETHhistoryPagination;
    this.onGetETHHistory(Limit, page+1);
  }
  onChangeETHHistoryRowsPerPage = (perPage) => {
    this.onGetETHHistory(perPage, 1);
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

  handleTabChange = (e, value) => {
    this.setState({ tabIndex: value });
  }

  render = () => {
    const {asset = {}, isDCBConverting, isGettingReserveInfo, isSummitting, openDialog, openMetamaskDialog, history = [],historyPagination = {}, ETHhistory = [], ETHhistoryPagination = {}, purchaseStats = {} ,reserveInfo, convertToToken, tabIndex } = this.state;
    const disableSubmitBtn = (asset === "" || isSummitting || isGettingReserveInfo || isDCBConverting);

    const {TotalReservesSuccess = {}, TotalReservesFailed = {}, TotalAmountSuccess = {}, TotalAmountFailed = {}} = purchaseStats;

    return (
      <div className="home-page">
        <section >
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="c-card">
                <div className="hello">
                  Reserve Assets
                </div>
                <div className="row stats-container" style={{display: "flex", justifyContent: "center"}}>

                  <div className="col-12 col-sm-3 col-lg-3 stats">
                    <div className="value">
                      { TotalReservesSuccess.usd || 0}
                      &nbsp;
                      <sup>by USD</sup>
                    </div>
                    <div className="value">
                      {TotalReservesSuccess.eth || 0}
                      &nbsp;
                      <sup>by ETH</sup>
                    </div>
                    <div className="text-truncate">Success</div>
                  </div>

                  <div className="col-12 col-sm-3 col-lg-3 stats">
                    <div className="value">
                      { TotalReservesFailed.usd || 0}
                      &nbsp;
                      <sup>by USD</sup>
                    </div>
                    <div className="value">
                      { TotalReservesFailed.eth || 0}
                      &nbsp;
                      <sup>by ETH</sup>
                    </div>
                    <div className="text-truncate">Failed</div>
                  </div>

                  <div className="col-12 col-sm-3 col-lg-3 stats">
                    <div className="value">
                      { TotalAmountSuccess.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      {TotalAmountSuccess.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div className="text-truncate">Amount Success</div>
                  </div>

                  <div className="col-12 col-sm-3 col-lg-3 stats">
                    <div className="value">
                      { TotalAmountFailed.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      { TotalAmountFailed.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div className="text-truncate">Amount Failed</div>
                  </div>

                </div>
              </div>

            </div>

            <div className="col-lg-4 d-none d-lg-block">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 280, backgroundSize: "100%" }}>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-12 my-3">
              <div className="c-card">
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
                        border: `1px solid ${asset.name === collateral.name ? '#212B63' : '#E4E7F2'}`,
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

                <Formik
                  initialValues={{
                    amount: null,
                  }}
                  onSubmit={() => {
                    if (!disableSubmitBtn) {
                      this.onSubmit();
                    }
                  }}
                >
                  {({ errors }) => (
                    <Form className="form">
                      <div className="row group-input">
                        <div className="col-xs-12 col-lg-3">
                          <div className="title text-truncate">ENTER AMOUNT</div>
                          <Field
                            name="amount"
                            validate={value => value <= 0 && 'Must be greater than 0'}
                            render={({ field: { onChange, ...otherProps } }) => (
                              <TextField
                                className="input-of-create cst"
                                type="number"
                                style={{
                                  lineHeight: '2em',
                                }}
                                fullWidth
                                InputProps={{
                                  style: { paddingTop: 10, paddingBottom: 10, height: 'inherit !important' },
                                }}
                                onChange={(...args) => {
                                  onChange(...args);
                                  this.onAmountChange(...args);
                                }}
                                {...otherProps}
                              />
                            )}
                          />
                          <ErrorMessage name="amount" />
                        </div>
                        <div className="col-xs-12 col-lg-3">
                          <div className="title text-truncate">
                            CONVERT TO TOKEN
                            { isDCBConverting && (
                              <CircularProgress style={{ width: 'auto', height: 'auto', marginLeft: '10px' }} />
                            ) }
                          </div>
                          <TextField
                            id="eth-to-token"
                            type="number"
                            style={{
                              lineHeight: "2em",
                            }}
                            fullWidth
                            InputProps={{
                              style: {paddingTop: 10, paddingBottom: 10, height:"inherit !important"},
                            }}
                            disabled
                            value={convertToToken}
                          />
                        </div>
                        <div className="col-xs-12 col-lg-3">
                          <div className="title text-truncate">
                            AVAILABLE TOKEN AMOUNT
                            { isGettingReserveInfo && (
                              <CircularProgress style={{ width: 'auto', height: 'auto', marginLeft: '10px' }} />
                            ) }
                          </div>
                          <TextField
                            id="left-token"
                            type="number"
                            style={{
                              lineHeight: "2em",
                            }}
                            fullWidth
                            InputProps={{
                              style: {paddingTop: 10, paddingBottom: 10, height:"inherit !important"},
                            }}
                            disabled
                            value={reserveInfo.LeftToken}
                          />
                        </div>
                      </div>
                      {
                        isSummitting ?
                          <div style={{display: "flex", justifyContent:"center"}}>
                            <CircularProgress style={{width: "auto", height:"auto"}} />
                          </div>
                        :
                          <button className="c-btn c-btn-primary submit"  style={{width: "100%"}} type="submit" disabled={disableSubmitBtn || errors.amount}>
                            Get DCB Token
                            &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                          </button>
                      }
                    </Form>
                  )}
                </Formik>
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
          <Tabs indicatorColor="primary" className="container tabs-container" value={tabIndex} onChange={this.handleTabChange}>
            <Tab label="ETH" value={1} classes={{ root: 'tab', selected: 'tab-selected' }} />
            <Tab label="USD" value={0} classes={{ root: 'tab', selected: 'tab-selected' }} />
          </Tabs>
          <div className="container">
            <div className="row">
              <div className="col-12">
                {tabIndex === 0 ?
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
                          history && history.length ? history.map((item={}) => {
                            return (
                              <tr key={`history-${item.ID}`} >
                                <td>{item.ID}</td>
                                <td>{item.Amount}</td>
                                <td className={`c-status ${RESERVE_HISTORY_STATUS_COLOR[item.Status]}`}>{item.Status}</td>
                                <td>{dayjs(item.CreatedAt).format('MM-DD-YYYY')}</td>
                              </tr>
                            )
                          }) : <tr><td colSpan={4}><span className='d-block text-center'>No data</span></td></tr>
                        }
                    </tbody>
                  </table>
                  {history.length > 0 && historyPagination && Object.keys(historyPagination).length > 0 ?
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={historyPagination.TotalRecord}
                      rowsPerPage={historyPagination.Limit}
                      page={historyPagination.Page-1}
                      SelectProps={{
                        // native: true,
                      }}
                      onChangePage={(e,p)=>this.onChangeHistoryPage(p)}
                      onChangeRowsPerPage={(e)=>this.onChangeHistoryRowsPerPage(e.target.value)}
                      // ActionsComponent={TablePaginationActionsWrapped}
                    />
                  : ""}
                </div>
                :
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
                          ETHhistory && ETHhistory.length ? ETHhistory.map((item={}) => {
                            return (
                              <tr key={`history-${item.ID}`} >
                                <td>{item.ID}</td>
                                <td>{item.Amount}</td>
                                <td className={`c-status ${RESERVE_HISTORY_STATUS_COLOR[item.Status]}`}>{item.Status}</td>
                                <td>{dayjs(item.CreatedAt).format('MM-DD-YYYY')}</td>
                              </tr>
                            )
                          }) : <tr><td colSpan={4}><span className='d-block text-center'>No data</span></td></tr>
                        }
                    </tbody>
                  </table>
                  {ETHhistory.length  > 0 && ETHhistoryPagination && Object.keys(ETHhistoryPagination).length > 0 ?
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={ETHhistoryPagination.TotalRecord}
                      rowsPerPage={ETHhistoryPagination.Limit}
                      page={ETHhistoryPagination.Page-1}
                      SelectProps={{
                        native: true,
                      }}
                      onChangePage={(e,p)=>this.onChangeETHHistoryPage(p)}
                      onChangeRowsPerPage={(e)=>this.onChangeETHHistoryRowsPerPage(e.target.value)}
                    />
                  : ""}
                </div>
                }
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(BuyToken);

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
