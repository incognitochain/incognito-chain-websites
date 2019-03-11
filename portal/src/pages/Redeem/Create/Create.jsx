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
      hiddenETHAddr: false,
      status: '',
    };
    const { authCheckAuth } = this.props;
    authCheckAuth();
  }

  componentDidMount() {
    document.title = 'Create a redeem request - Constant';
  }

  componentWillUnmount() {

  }

  // form
  changeRedeemAmount = (e, setFieldValue, cb = () => { }) => {
    const { currentCollateral } = this.state;
    if (currentCollateral.name === 'ETH') {
      this.setState({
        hiddenETHAddr: false,
      });
      if (!e.target.value) {
        setFieldValue('etherAmount', 0);
      } else {
        const data = {
          constant_amount: parseInt(e.target.value, 0) * 1000,
        };
        axios.post(API.RESERVE_CONVERT_CST_TO_ETH, data).then((res) => {
          if (res.status === 200) {
            if (res.data && res.data.Result) {
              setFieldValue('etherAmount', res.data.Result);
            }
          }
        }).catch((e) => {
          console.log(e);
          catchError(e);
        });
      }
    }
    if (currentCollateral.name === 'USD') {
      this.setState({
        hiddenETHAddr: true,
      });
      setFieldValue('etherAmount', 0);
    }
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
    setSubmitting(false);
    setSubmitting(true);
  }

  submitByETH = (values, setSubmitting) => {
    const { routerPush } = this.props;
    setSubmitting(false);
    const data = {
      receiver_address: values.receiverAddress,
      constant_amount: parseInt(values.redeemAmount, 0) * 1000,
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
      hiddenETHAddr,
    } = this.state;

    return (
      <div className="create-page">
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
                    redeemAmount: '',
                    etherAmount: '0.00',
                    receiverAddress: '0x088D8A4a03266870EDcbbbADdA3F475f404dB9B2',
                    policy: false,
                    routingNumber: '',
                    swiftCode: '',
                    achCheckType: 'personal',
                    bankCountry: 'US',
                    bankAccountName: '',
                    bankAccountType: '',
                    bankAccountNumber: '',
                    bankName: '',
                    beneficiaryAddressStreet1: '',
                    beneficiaryAddressStreet2: '',
                    beneficiaryAddressRegion: '',
                    beneficiaryAddressCity: '',
                    beneficiaryAddressPostalCode: '',
                    beneficiaryAddressCountry: 'US',
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.redeemAmount) {
                      errors.redeemAmount = 'Required';
                    }
                    if (currentCollateral.name === 'ETH' && !values.receiverAddress) {
                      errors.receiverAddress = 'Required';
                    }
                    if (currentCollateral.name === 'USD' && !values.routingNumber) {
                      errors.routingNumber = 'Required';
                    }
                    if (currentCollateral.name === 'USD' && !values.swiftCode) {
                      errors.swiftCode = 'Required';
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
                          isShown={isValid && isSubmitting}
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
                                  name="redeemAmount"
                                  placeholder="100"
                                  className="input-of-create cst"
                                  value={values.redeemAmount}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    this.onlyNumber(e.target.value, () => {
                                      this.inputChange(handleChange, setFieldTouched, 'redeemAmount', e);
                                      this.changeRedeemAmount(e, setFieldValue);
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
                                      this.setState({ currentCollateral: collateral }, () => {
                                        this.changeRedeemAmount({ target: { value: values.redeemAmount } }, setFieldValue);
                                      });
                                    }}
                                  >
                                    <FontAwesomeIcon icon={collateral.icon} size="2x" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {
                            hiddenETHAddr ? (
                              <div className="row input-container input-container-first">
                                <div className="col-12 col-md-6 col-lg-4">
                                  <div className="title">ENTER YOUR BANK</div>
                                  <div className="input">
                                    <TextField
                                      name="routingNumber"
                                      placeholder=""
                                      className="input-of-create cst"
                                      value={values.routingNumber}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        this.inputChange(handleChange, setFieldTouched, 'routingNumber', e);
                                      }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">RoutingNumber</InputAdornment>,
                                      }}
                                    />
                                    {errors.routingNumber && touched.routingNumber && <span className="c-error"><span>{errors.routingNumber}</span></span>}
                                  </div>

                                  <div className="input">
                                    <TextField
                                      name="swiftCode"
                                      placeholder=""
                                      className="input-of-create cst"
                                      value={values.swiftCode}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        this.inputChange(handleChange, setFieldTouched, 'swiftCode', e);
                                      }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">SwiftCode</InputAdornment>,
                                      }}
                                    />
                                    {errors.swiftCode && touched.swiftCode && <span className="c-error"><span>{errors.swiftCode}</span></span>}
                                  </div>

                                  <div className="input">
                                    <TextField
                                      name="achCheckType"
                                      placeholder=""
                                      className="input-of-create cst"
                                      value={values.achCheckType}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        this.inputChange(handleChange, setFieldTouched, 'achCheckType', e);
                                      }}
                                      InputProps={{
                                        startAdornment: <InputAdornment position="start">AchCheckType</InputAdornment>,
                                      }}
                                    />
                                    {errors.achCheckType && touched.achCheckType && <span className="c-error"><span>{errors.achCheckType}</span></span>}
                                  </div>

                                </div>
                              </div>
                            ) : (
                              <div className="row input-container input-container-first">
                                <div className="col-12 col-md-6 col-lg-4">
                                  <div className="title">ENTER ETHER ADDRESS</div>
                                  <div className="input">
                                    <TextField
                                      type="text"
                                      name="receiverAddress"
                                      placeholder="0x088D8A4a03266870EDcbbbADdA3F475f404dB9B2"
                                      className="input-of-create cst"
                                      value={values.receiverAddress}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        this.inputChange(handleChange, setFieldTouched, 'receiverAddress', e);
                                      }}
                                    />
                                    {errors.receiverAddress && touched.receiverAddress && <span className="c-error"><span>{errors.receiverAddress}</span></span>}
                                  </div>
                                  <div className="input">{`${values.etherAmount} ETH`}</div>
                                </div>
                              </div>
                            )
                          }
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
