import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faSpinnerThird } from '@fortawesome/pro-light-svg-icons';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@/components/Link';
import { axios, catchError } from '@/services/api';
import rawAxios from 'axios';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { toaster } from 'evergreen-ui';
import abiDefinition from '@/pages/Create/abiDefinition';
import { detectInstalled, requestUnlockMetamask, init } from '@/reducers/metamask/action';
import { Dialog } from 'evergreen-ui';
import detectBrowser from 'detect-browser';
import { push } from 'connected-react-router';
import { checkAuth } from '@/reducers/auth/action';

class Create extends React.Component {
  static propTypes = {
    metamaskInit: PropTypes.func.isRequired,
    metamaskDetectInstalled: PropTypes.func.isRequired,
    metamaskRequestUnlock: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired,
    authCheckAuth: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const collaterals = [
      { name: 'BTC', icon: faBitcoin },
      { name: 'ETH', icon: faEthereum },
    ];

    this.state = {
      collaterals,
      currentCollateral: collaterals[1],
      rates: [],
      currentRate: {},
      maturity: dayjs().format('MM-DD-YYYY'),
      disabledBTC: true,
      price: {
        btc: 1,
        eth: 1,
      },
      collateralAmountPlaceholder: '100',
      wantUsePrivateKey: false,
      dialogInstall: false,
      dialogUnlock: false,
      dialogWantUsePrivateKey: false,
      status: '',
      finish: false,
    };

    axios.get(API.LOAN_PARAMS).then(res => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result && Result.length) {
          const currentRate = Result[0];
          this.setState({ rates: Result, currentRate });
          this.calcMaturity(currentRate);
          return;
        }
      }
    }).catch(e => {
      catchError(e);
    });

    this.getTickerOfBTC();
    this.getTickerOfETH();

    const { metamaskDetectInstalled, metamaskInit, authCheckAuth } = this.props;
    authCheckAuth();
    metamaskDetectInstalled(() => {
      metamaskInit();
    });
  }

  componentDidMount() {
    document.title = 'Create a loan request - constant.money';
  }

  componentWillUnmount() {

  }

  // metadata
  getTickerOfBTC = () => {
    /*
    https://api.hitbtc.com/api/2/public/ticker
    https://api.coindesk.com/v1/bpi/currentprice.json
    https://www.bitstamp.net/api/ticker/
    https://blockchain.info/ticker
    */
    rawAxios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/').then(res => {
      const { data } = res;
      if (data && data.length) {
        const { price_usd } = data[0];
        const { price } = this.state;
        this.setState({ price: { ...price, btc: Number(price_usd) } });
      }
    });
    // TODO: fetch per xxx second
  }

  getTickerOfETH = () => {
    /*
    */
    rawAxios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/').then(res => {
      const { data } = res;
      if (data && data.length) {
        const { price_usd } = data[0];
        const { price } = this.state;
        this.setState({ price: { ...price, eth: Number(price_usd) } });
      }
    });
    // TODO: fetch per xxx second
  }

  // data in form
  calcMaturity = (currentRate) => {
    const { currentCollateral } = this.state;
    const maturity = currentRate.Maturity || currentCollateral.Maturity; // in block time
    const maturityInSecond = maturity * (0.1 * 60); // 10 minutes for a new block // TODO
    const now = new Date();
    let nowInSecond = (now / 1000 | 0);
    nowInSecond += (maturityInSecond - 3600);
    const maturityFormated = dayjs.unix(nowInSecond).format('MM-DD-YYYY');
    this.setState({ maturity: maturityFormated });
  }

  // form
  changeLoanAmount = (e, setFieldValue, cb = () => { }) => {
    const { currentRate, price, currentCollateral } = this.state;
    const { LiquidationStart } = currentRate;
    const { value } = e.target;
    const fix = { 'ETH': 2, 'BTC': 10 };
    let collateralAmount = value;

    if (LiquidationStart && value) {
      const collateralType = currentCollateral.name.toLowerCase();
      const rate = price[collateralType];
      collateralAmount = ((parseInt(value) / rate) * (LiquidationStart / 10000)).toFixed(fix[currentCollateral.name]);
    }

    setFieldValue('collateralAmount', collateralAmount);
    this.setState({ collateralAmountPlaceholder: collateralAmount || '100' }, cb);
  }

  inputChange = (handleChange, setFieldTouched, name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  }

  onlyNumber = (value, cb) => {
    if (Number.isNaN(Number(value))) {
      return;
    } else {
      cb();
    }
  }

  // dialogs
  unlockMetamask = () => {
    const { metamaskRequestUnlock } = this.props;
    metamaskRequestUnlock();
  }

  showAskInstall = (values, setSubmitting) => {
    this.setState({ dialogInstall: true, setSubmitting, status: 'Please check your Metamask extension' });
  }

  showAskUnlock = (values, setSubmitting) => {
    const { metamask, metamaskRequestUnlock } = this.props;
    this.setState({ setSubmitting });

    if (!metamask.unlocked) {
      metamaskRequestUnlock(() => {
        this.setState({ dialogUnlock: false });
        this.handleETH(values);
      }, () => {
        this.setState({ dialogUnlock: true, status: 'Please check your Metamask extension' });
      });
    } else {
      this.handleETH(values);
    }
  }

  handleETH = async (values) => {
    const { secretKey, collateralAmount, loanAmount } = values;
    const { setSubmitting, maturity, currentRate } = this.state;
    const { routerPush, auth } = this.props;
    const { address, web3 } = this.props.metamask;
    const contractInstance = new web3.eth.Contract(abiDefinition, process.env.loanSmartContractAddress);
    const constantPaymentAddress = auth.data.PaymentAddress;
    const digestKey = web3.utils.fromAscii(secretKey);
    const lid = web3.utils.fromAscii("");
    const offChain = web3.utils.fromAscii("");
    const accounts = await web3.eth.getAccounts();
    contractInstance.methods.sendCollateral(lid, digestKey, constantPaymentAddress, loanAmount * 100, offChain).send({
      from: accounts[0],
      value: parseFloat(collateralAmount) * Math.pow(10, 18),
    }).on('transactionHash', (hash) => {
      console.log('transactionHash', hash);
      this.setState({ status: 'Waiting for this transaction complete. (~2 mins)' });
    }).on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber, receipt);
    }).on("receipt", function (receipt) {

      const result = {
        err: null,
        data: receipt.events.__sendCollateral.returnValues,
      };

      const loanID = result.data.lid;
      const startDate = dayjs().format('YYYY-MM-DD');
      const endDate = dayjs(maturity).format('YYYY-MM-DD');

      const data = {
        "StartDate": startDate,
        "EndDate": endDate,
        "LoanRequest": {
          "Params": currentRate,
          "LoanID": loanID,
          "CollateralType": 'ETH',
          "CollateralAmount": collateralAmount,
          "LoanAmount": parseInt(Number(loanAmount) * 100, 10),
          "ReceiveAddress": "",
          "KeyDigest": web3.utils.soliditySha3(web3.utils.toHex(secretKey)),
        }
      };

      axios.post(API.LOAN_SUBMIT, data).then(res => {
        if (res.status === 200) {
          if (res.data && res.data.Result) {
            const { Result } = res.data;
            routerPush(`/loan/${Result.ID}`);
          }
        }
        setSubmitting(false);
      }).catch(e => {
        catchError(e);
        setSubmitting(false);
      });
      // success
    }).on('err', function (err) {
      console.log(err);
      const result = {
        err: err,
        data: null,
      }
      console.log(result);
      setSubmitting(false);
      toaster.danger(`This transaction failed, error: ${err.toString()}`);
      // error
    }).catch(e => {
      catchError(e);
      setSubmitting(false);
      if (e.message.includes('User denied')) {
        toaster.warning('You denied this transaction');
      }
    });
  }

  linkMetamask = () => {
    const browser = detectBrowser.detect();
    switch (browser && browser.name) {
      case 'chrome':
        return (<a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">get Chrome extension</a>);
      case 'firefox':
        return (<a href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" target="_blank">get Firefox extension</a>);
        break;
      default:
        return 'Please use brower based on Chrome, Firefox or Brave';
    }
  }

  dialogCancel = () => {
    const { setSubmitting } = this.state;
    setSubmitting(false);
    this.setState({ setSubmitting: () => { } });
  }

  // submit handler
  handleSubmit = (values, setSubmitting) => {
    const { currentCollateral } = this.state;
    if (currentCollateral.name === 'ETH') {
      this.submitByETH(values, setSubmitting);
    }
    if (currentCollateral.name === 'BTC') {

    }
  }

  submitByETH = (values, setSubmitting) => {
    const { installed } = this.props.metamask;

    if (installed) {
      this.showAskUnlock(values, setSubmitting);
    } else {
      this.showAskInstall(values, setSubmitting);
    }
  }

  submitByBTC = (values) => {

  }

  //
  render() {
    const { status, collaterals, currentCollateral, rates, currentRate, maturity, disabledBTC, collateralAmountPlaceholder, dialogInstall, dialogUnlock, dialogWantUsePrivateKey } = this.state;

    return (
      <div className="create-page">
        <Dialog
          isShown={dialogWantUsePrivateKey}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          hasHeader={false}
          title="Import your private key"
          cancelLabel="Cancel"
          confirmLabel="Import"
          onConfirm={() => { }}
          onCancel={() => { this.dialogCancel(); this.setState({ dialogWantUsePrivateKey: false }); }}
        >
          This feature is building.
        </Dialog>
        <Dialog
          isShown={dialogInstall}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          hasHeader={false}
          title="Ethereum transaction handler"
          onCloseComplete={() => this.setState({ dialogInstall: false })}
          cancelLabel="Use my Ethereum Private Key"
          confirmLabel="I have installed MetaMask"
          onConfirm={() => { window.location.reload(); }}
          onCancel={() => this.setState({ dialogInstall: false, wantUsePrivateKey: true, dialogWantUsePrivateKey: true })}
        >
          You need to install Metamask ({this.linkMetamask()}) or import your Ethereum Private Key to continue.
        </Dialog>
        <Dialog
          isShown={dialogUnlock}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          hasHeader={false}
          title="Ethereum transaction handler"
          onCloseComplete={() => this.setState({ dialogUnlock: false })}
          cancelLabel="Use my Ethereum Private Key"
          confirmLabel="I have unlocked MetaMask"
          onConfirm={() => { this.showAskUnlock(this.state.setSubmitting); }}
          onCancel={() => this.setState({ dialogUnlock: false, wantUsePrivateKey: true, dialogWantUsePrivateKey: true })}
        >
          You need to unlock your Metamask or import your Ethereum Private Key to continue.
        </Dialog>
        <div className="create-hero">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2>Constant loans backed by your crypto assets</h2>
                <p>Use your crypto to get Constant without selling</p>
              </div>
            </div>
          </div>
        </div>
        <div className="create-content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <Formik
                  initialValues={{ loanAmount: '', collateralAmount: '', secretKey: '', policy: false }}
                  validate={values => {
                    let errors = {};
                    if (!values.loanAmount) {
                      errors.loanAmount = 'Required';
                    }
                    if (!values.collateralAmount) {
                      errors.collateralAmount = 'Required';
                    } else {
                      if (values.loanAmount && Number(values.collateralAmount) < collateralAmountPlaceholder) {
                        errors.collateralAmount = 'Collateral amount must greater than minimum value';
                      }
                    }
                    if (!values.secretKey) {
                      errors.secretKey = 'Required';
                    }
                    if (!values.policy) {
                      errors.policy = 'You must accept with this policy.';
                    }
                    return errors;
                  }}
                  validateOnBlur={false}
                  // validateOnChange={false}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      this.handleSubmit(values, setSubmitting);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    isValid,
                  }) => (
                      <form onSubmit={handleSubmit} autoComplete="off">
                        <Dialog
                          isShown={isValid && isSubmitting && !dialogInstall && !dialogUnlock && !dialogWantUsePrivateKey}
                          shouldCloseOnOverlayClick={false}
                          shouldCloseOnEscapePress={false}
                          hasHeader={false}
                          hasFooter={false}
                        >
                          <div style={{ textAlign: 'center', margin: '20px 0' }}>
                            <div> <FontAwesomeIcon icon={faSpinnerThird} size="3x" spin={true} color="##2D4EF5" /></div>
                            <div style={{ marginTop: 10 }}>Loading....</div>
                            <div>{status}</div>
                            <div style={{ color: '#ff0000' }}><strong>PLEASE DON'T CLOSE THIS TAB</strong></div>
                          </div>
                        </Dialog>
                        <div className="create-box c-card">
                          <h2>Create a loan request</h2>
                          <div className="">
                            Or <Link to="/"><FontAwesomeIcon icon={faAngleLeft} /> Back to home</Link>
                          </div>
                          <div className="row input-container input-container-first">
                            <div className="col-12 col-md-12 col-lg-4">
                              <div className="title">CHOOSE YOUR COLLATERAL</div>
                              <div className="input">
                                {collaterals.map(collateral => (
                                  <div key={collateral.name} className={`collateral-option ${currentCollateral.name === collateral.name ? 'active' : ''}`} onClick={() => {
                                    if (disabledBTC && collateral.name === 'BTC') {
                                      toaster.warning('We don\'t support BTC yet', { duration: 10000 });
                                      return;
                                    }
                                    this.setState({ currentCollateral: collateral }, () => {
                                      this.changeLoanAmount({ target: { value: values.loanAmount } }, setFieldValue);
                                    });
                                  }}>
                                    <FontAwesomeIcon icon={collateral.icon} size="2x" />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                              <div className="title">ENTER LOAN AMOUNT</div>
                              <div className="input">
                                <TextField
                                  name="loanAmount"
                                  placeholder="100"
                                  className="input-of-create cst"
                                  value={values.loanAmount}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    this.onlyNumber(e.target.value, () => {
                                      this.inputChange(handleChange, setFieldTouched, "loanAmount", e);
                                      this.changeLoanAmount(e, setFieldValue);
                                    });
                                  }}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">CST</InputAdornment>,
                                  }}
                                />
                                {errors.loanAmount && touched.loanAmount && <span className="c-error"><span>{errors.loanAmount}</span></span>}
                              </div>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                              <div className="title">COLLATERAL AMOUNT</div>
                              <div className="input">
                                <TextField
                                  name="collateralAmount"
                                  placeholder={collateralAmountPlaceholder}
                                  className="input-of-create collateral"
                                  value={values.collateralAmount}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    this.onlyNumber(e.target.value, () => {
                                      this.inputChange(handleChange, setFieldTouched, "collateralAmount", e);
                                    });
                                  }}
                                  InputProps={{
                                    endAdornment: <InputAdornment position="end">{currentCollateral.name}</InputAdornment>,
                                  }}
                                />
                                {errors.collateralAmount && touched.collateralAmount && <span className="c-error"><span>{errors.collateralAmount}</span></span>}
                                <div>Collateral amount based on a 35% Loan to Value (LTV).</div>
                                <div>{values.loanAmount ? `(minimum: ${collateralAmountPlaceholder})` : ''}</div>
                              </div>
                            </div>
                          </div>
                          <div className="row input-container">
                            <div className="col-12 col-md-4">
                              <div className="title">Your Backup Code</div>
                              <div className="input">
                                <TextField
                                  type="password"
                                  placeholder="*****"
                                  className="input-of-create"
                                  name="secretKey"
                                  autoComplete="off"
                                  onChange={(e) => {
                                    this.inputChange(handleChange, setFieldTouched, "secretKey", e);
                                  }}
                                />
                                {errors.secretKey && touched.secretKey && <span className="c-error"><span>{errors.secretKey}</span></span>}
                              </div>
                            </div>
                            <div className="col-12 col-md-4">
                              <div className="title">Maturity</div>
                              <div className="input">
                                <TextField
                                  placeholder="100"
                                  className="input-of-create maturity"
                                  value={maturity}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-4">
                              <div className="title">INTEREST RATE</div>
                              <div className="input">
                                {rates.map(rate => (
                                  <div key={rate.InterestRate} className={`rate ${rate.InterestRate === currentRate.InterestRate ? 'active' : ''}`} onClick={() => { this.setState({ currentRate: rate }); this.calcMaturity(rate); }}>{(rate.InterestRate / 100).toFixed(2)}%</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <label><input type="checkbox" name="policy" value={values.policy} onChange={handleChange} /> I certify that I am 18 years of age or older, and I agree to the Terms & Conditions.</label>
                              {errors.policy && touched.policy && <span className="c-error"><span>{errors.policy}</span></span>}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <button className="c-btn c-btn-primary submit" type="submit">
                                {isSubmitting ? <FontAwesomeIcon icon={faSpinnerThird} size="1x" spin={true} style={{ marginRight: 10 }} /> : ''}
                                Submit <FontAwesomeIcon icon={faArrowRight} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  metamask: state.metamask,
}), ({
  metamaskInit: init,
  metamaskDetectInstalled: detectInstalled,
  metamaskRequestUnlock: requestUnlockMetamask,
  routerPush: push,
  authCheckAuth: checkAuth,
}))(Create);
