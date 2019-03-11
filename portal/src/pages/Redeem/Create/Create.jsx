import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faSpinnerThird, faUsdCircle, faUsdSquare } from '@fortawesome/pro-light-svg-icons';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@/components/Link';
import { axios, catchError } from '@/services/api';
import rawAxios from 'axios';
import { API, BLOCKCHAIN } from '@/constants';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { toaster, Dialog } from 'evergreen-ui';
import abiDefinition from '@/pages/Create/abiDefinition';
import { detectInstalled, requestUnlockMetamask, init } from '@/reducers/metamask/action';
import { detect } from 'detect-browser';
import { push } from 'connected-react-router';
import { checkAuth } from '@/reducers/auth/action';

class Create extends React.Component {
  static propTypes = {
    metamask: PropTypes.object.isRequired,
    metamaskInit: PropTypes.func.isRequired,
    metamaskDetectInstalled: PropTypes.func.isRequired,
    metamaskRequestUnlock: PropTypes.func.isRequired,
    routerPush: PropTypes.func.isRequired,
    authCheckAuth: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const collaterals = [
      { name: 'USD', icon: faUsdCircle },
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
    };

    axios.get(API.LOAN_PARAMS).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result && Result.length) {
          const currentRate = Result[0];
          this.setState({ rates: Result, currentRate });
          this.calcMaturity(currentRate);
        }
      }
    }).catch((e) => {
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
    document.title = 'Create a loan request - Constant';
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
    rawAxios.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/').then((res) => {
      const { data } = res;
      if (data && data.length) {
        const { price_usd: priceUsd } = data[0];
        const { price } = this.state;
        this.setState({ price: { ...price, btc: Number(priceUsd) } });
      }
    });
    // TODO: fetch per xxx second
  }

  getTickerOfETH = () => {
    /*
    */
    rawAxios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/').then((res) => {
      const { data } = res;
      if (data && data.length) {
        const { price_usd: priceUsd } = data[0];
        const { price } = this.state;
        this.setState({ price: { ...price, eth: Number(priceUsd) } });
      }
    });
    // TODO: fetch per xxx second
  }

  // data in form
  calcMaturity = (currentRate) => {
    const { currentCollateral } = this.state;
    const maturity = currentRate.Maturity || currentCollateral.Maturity; // in block time
    // 10 minutes for a new block // TODO
    const maturityInSecond = maturity * (BLOCKCHAIN.BLOCK_IN_SECOND);
    const now = new Date();
    let nowInSecond = parseInt(now / 1000, 10);
    nowInSecond += (maturityInSecond - 3600);
    const maturityFormated = dayjs.unix(nowInSecond).format('MM-DD-YYYY');
    this.setState({ maturity: maturityFormated });
  }

  // form
  changeLoanAmount = (e, setFieldValue, cb = () => { }) => {
    const { currentRate, price, currentCollateral } = this.state;
    const { LiquidationStart } = currentRate;
    const { value } = e.target;
    const fix = { ETH: 2, BTC: 10 };
    let collateralAmount = value;

    if (LiquidationStart && value) {
      const collateralType = currentCollateral.name.toLowerCase();
      const rate = price[collateralType];
      collateralAmount = ((parseInt(value, 10) / rate) * (LiquidationStart / 10000)).toFixed(fix[currentCollateral.name]);
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
    if (!Number.isNaN(Number(value))) {
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
    const { secretKey: rawSecretKey, collateralAmount, loanAmount } = values;
    const { setSubmitting, maturity, currentRate } = this.state;
    const { routerPush, auth, metamask } = this.props;
    const { web3 } = metamask;

    const secretKey = `a${rawSecretKey}`;

    const contractInstance = new web3.eth.Contract(abiDefinition, process.env.loanSmartContractAddress);

    const constantPaymentAddress = auth.data.PaymentAddress;
    const digestKey = web3.utils.soliditySha3(web3.utils.toHex(secretKey));
    const lid = web3.utils.fromAscii('');
    const offChain = web3.utils.fromAscii('');
    const accounts = await web3.eth.getAccounts();

    console.log(digestKey);

    contractInstance.methods.sendCollateral(lid, digestKey, web3.utils.toHex(constantPaymentAddress), parseInt(Number(loanAmount) * 100, 10), offChain).send({
      from: accounts[0],
      value: parseFloat(collateralAmount) * (10 ** 18),
    })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
        this.setState({ status: 'Waiting for this transaction complete. (~2 mins)' });
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt);
      })
      .on('receipt', (receipt) => {
        try {
          const { events } = receipt;
          const { __sendCollateral: sendCollateral } = events;
          const { returnValues } = sendCollateral;
          const result = {
            err: null,
            data: returnValues,
          };

          const loanID = result.data.lid;
          const startDate = dayjs().format('YYYY-MM-DD');
          const endDate = dayjs(maturity).format('YYYY-MM-DD');

          const data = {
            StartDate: startDate,
            EndDate: endDate,
            LoanRequest: {
              Params: currentRate,
              LoanID: loanID.substr(2),
              CollateralType: 'ETH',
              CollateralAmount: collateralAmount.etherToWei(),
              LoanAmount: parseInt(Number(loanAmount) * 100, 10),
              ReceiveAddress: '',
              KeyDigest: digestKey.substr(2),
            },
          };

          axios.post(API.LOAN_SUBMIT, data).then((res) => {
            if (res.status === 200) {
              if (res.data && res.data.Result) {
                const { Result } = res.data;
                routerPush(`/loan/${Result.LoanID}`);
              }
            }
            setSubmitting(false);
          }).catch((e) => {
            console.log(e);
            catchError(e);
            setSubmitting(false);
          });
        } catch (e) {
          toaster.danger('Lỗi by @duybao');
          setSubmitting(false);
          console.log(e);
        }
        // success
      })
      .on('err', (err) => {
        console.log(err);
        const result = {
          err,
          data: null,
        };
        console.log(result);
        setSubmitting(false);
        toaster.danger(`This transaction failed, error: ${err.toString()}`);
        // error
      })
      .catch((e) => {
        catchError(e);
        setSubmitting(false);
        if (e.message.includes('User denied')) {
          toaster.warning('You denied this transaction');
        }
        console.log(e);
      });
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

  dialogCancel = () => {
    const { setSubmitting } = this.state;
    setSubmitting(false);
    this.setState({ setSubmitting: () => { } });
  }

  // submit handler
  handleSubmit = (values, setSubmitting) => {
    const { currentCollateral, wantUsePrivateKey } = this.state;
    if (wantUsePrivateKey) {
      return true;
    }
    if (currentCollateral.name === 'USD') {
      this.submitByUSD(values, setSubmitting);
    }
    if (currentCollateral.name === 'ETH') {
      this.submitByETH(values, setSubmitting);
    }
    return true;
  }

  submitByUSD = (values, setSubmitting) => {
    const { metamask } = this.props;
    const { installed } = metamask;

    if (installed) {
      this.showAskUnlock(values, setSubmitting);
    } else {
      this.showAskInstall(values, setSubmitting);
    }
  }

  submitByETH = (values, setSubmitting) => {
    const { routerPush } = this.props;
    setSubmitting(false);
    const data = {
      receiver_address: '',
      constant_amount: 10,
    };
    axios.post(API.RESERVE_BURN_CST_TO_ETH, data).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          routerPush('/redeem');
        }
      }
      setSubmitting(false);
    }).catch((e) => {
      console.log(e);
      catchError(e);
      setSubmitting(false);
    });
  }

  //
  render() {
    const {
      status,
      collaterals,
      currentCollateral,
      rates,
      currentRate,
      maturity, disabledBTC, collateralAmountPlaceholder, dialogInstall, dialogUnlock,
      dialogWantUsePrivateKey,
      setSubmitting: stateSetSubmitting,
    } = this.state;

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
          You need to install Metamask (
          {this.linkMetamask()}
          ) or import your Ethereum Private Key to continue.
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
          onConfirm={() => { this.showAskUnlock(stateSetSubmitting); }}
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
                  initialValues={{
                    redeemAmount: '', receiverAddress: '', secretKey: '', policy: false,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.redeemAmount) {
                      errors.loanAmount = 'Required';
                    }
                    if (values.redeemAmount && Number(values.collateralAmount) < collateralAmountPlaceholder) {
                      errors.receiverAddress = 'Collateral amount must greater than minimum value';
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
                          <div>
                            {' '}
                            <FontAwesomeIcon icon={faSpinnerThird} size="3x" spin color="##2D4EF5" />
                          </div>
                          <div style={{ marginTop: 10 }}>Loading....</div>
                          <div>{status}</div>
                          <div style={{ color: '#ff0000' }}>
                            <strong>
                              {"PLEASE DON'T CLOSE THIS TAB"}
                            </strong>
                          </div>
                        </div>
                      </Dialog>
                      <div className="create-box c-card">
                        <h2>Create a redeem request</h2>
                        <div className="">
                          {'Or '}
                          <Link to="/redeem">
                            <FontAwesomeIcon icon={faAngleLeft} />
                            {' Back to redeem'}
                          </Link>
                        </div>
                        <div className="row input-container input-container-first">
                          <div className="col-12 col-md-12 col-lg-4">
                            <div className="title">ENTER REDEEM AMOUNT</div>
                            <div className="input">
                              <TextField
                                name="loanAmount"
                                placeholder="100"
                                className="input-of-create cst"
                                value={values.redeemAmount}
                                autoComplete="off"
                                onChange={(e) => {
                                  this.onlyNumber(e.target.value, () => {
                                    this.inputChange(handleChange, setFieldTouched, 'loanAmount', e);
                                    this.changeLoanAmount(e, setFieldValue);
                                  });
                                }}
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">CST</InputAdornment>,
                                }}
                              />
                              {errors.redeemAmount && touched.redeemAmount && <span className="c-error"><span>{errors.redeemAmount}</span></span>}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-4">
                            <div className="title">CHOOSE YOUR OPTION</div>
                            <div className="input">
                              {collaterals.map(collateral => (
                                <div
                                  key={collateral.name}
                                  className={`collateral-option ${currentCollateral.name === collateral.name ? 'active' : ''}`}
                                  onClick={() => {
                                    // if (disabledBTC && collateral.name === 'BTC') {
                                    //   toaster.warning('We don\'t support BTC yet', { duration: 10000 });
                                    //   return;
                                    // }
                                    this.setState({ currentCollateral: collateral }, () => {
                                      this.changeLoanAmount({ target: { value: values.redeemAmount } }, setFieldValue);
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={collateral.icon} size="2x" />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-4">
                            <div className="title">ENTER ETHER ADDRESS</div>
                            <div className="input">
                              <TextField
                                name="receiverAddress"
                                placeholder="0x"
                                className="input-of-create cst"
                                value={values.receiverAddress}
                                autoComplete="off"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">CST</InputAdornment>,
                                }}
                              />
                              {errors.receiverAddress && touched.receiverAddress && <span className="c-error"><span>{errors.receiverAddress}</span></span>}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <label>
                              <input type="checkbox" name="policy" value={values.policy} onChange={handleChange} />
                              {' I certify that I am 18 years of age or older, and I agree to the Terms & Conditions.'}
                            </label>
                            {errors.policy && touched.policy && <span className="c-error"><span>{errors.policy}</span></span>}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <button className="c-btn c-btn-primary submit" type="submit">
                              {isSubmitting ? <FontAwesomeIcon icon={faSpinnerThird} size="1x" spin style={{ marginRight: 10 }} /> : ''}
                              {'Submit '}
                              <FontAwesomeIcon icon={faArrowRight} />
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
