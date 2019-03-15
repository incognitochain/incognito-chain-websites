import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faSpinnerThird, faUsdCircle, faUsdSquare } from '@fortawesome/pro-light-svg-icons';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@/components/Link';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import { Formik } from 'formik';
import { toaster, Dialog } from 'evergreen-ui';
import { detectInstalled, requestUnlockMetamask, init } from '@/reducers/metamask/action';
import { push } from 'connected-react-router';
import { checkAuth } from '@/reducers/auth/action';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const web3 = require('web3')

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
      if (!e.target.value || e.target.value <= 0) {
        setFieldValue('etherAmount', 0);
      } else {
        const data = {
          constant_amount: parseInt(e.target.value, 0) * 100,
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
    const { currentCollateral } = this.state;
    if (currentCollateral.name === 'USD') {
      this.submitByUSD(values, setSubmitting);
    }
    if (currentCollateral.name === 'ETH') {
      this.submitByETH(values, setSubmitting);
    }
    return true;
  }

  submitByUSD = (values, setSubmitting) => {
    const { routerPush } = this.props;
    setSubmitting(false);
    const data = {
      PaymentForm: {
        routingNumber: values.routingNumber,
        swiftCode: values.swiftCode,
        achCheckType: values.achCheckType,
        bankCountry: values.bankCountry,
        bankAccountName: values.bankAccountName,
        bankAccountType: values.bankAccountType,
        bankAccountNumber: values.bankAccountNumber,
        bankName: values.bankName,
        beneficiaryAddressStreet1: values.beneficiaryAddressStreet1,
        beneficiaryAddressStreet2: values.beneficiaryAddressStreet2,
        beneficiaryAddressRegion: values.beneficiaryAddressRegion,
        beneficiaryAddressCity: values.beneficiaryAddressCity,
        beneficiaryAddressPostalCode: values.beneficiaryAddressPostalCode,
        beneficiaryAddressCountry: values.beneficiaryAddressCountry,
      },
      Amount: parseInt(parseFloat(values.redeemAmount) * 100, 0)
    };
    axios.post(API.RESERVE_REDEEM_USD_CREATE, data).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          routerPush('/redeem');
        }
      }
      setSubmitting(false);
    }).catch((e) => {
      toaster.warning('Failed to submit request');
      console.log(e);
      catchError(e);
      setSubmitting(false);
    });
  }

  submitByETH = (values, setSubmitting) => {
    const { routerPush } = this.props;
    setSubmitting(false);
    const data = {
      receiver_address: values.receiverAddress,
      constant_amount: parseInt(parseFloat(values.redeemAmount) * 100, 0)
    };
    axios.post(API.RESERVE_REDEEM_ETH_CREATE, data).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          routerPush('/redeem');
        }
      }
      setSubmitting(false);
    }).catch((e) => {
      toaster.warning('Failed to submit request');
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
                <h2>Constant redeem</h2>
                <p>Use your constant for redeem</p>
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
                    receiverAddress: '',
                    policy: false,
                    routingNumber: '',
                    swiftCode: '',
                    achCheckType: 'personal',
                    bankCountry: 'US',
                    bankAccountName: '',
                    bankAccountType: 'checking',
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
                    if (currentCollateral.name === 'ETH') {
                      if (!values.receiverAddress) {
                        errors.receiverAddress = 'Required';
                      }
                      else if (!web3.utils.isAddress(values.receiverAddress)) {
                        errors.receiverAddress = 'Invalid';
                      }
                    }
                    if (currentCollateral.name === 'USD') {
                      if (!values.routingNumber) {
                        errors.routingNumber = 'Required';
                      }
                      if (!values.swiftCode) {
                        errors.swiftCode = 'Required';
                      }
                      if (!values.achCheckType) {
                        errors.achCheckType = 'Required';
                      }
                      if (!values.bankCountry) {
                        errors.bankCountry = 'Required';
                      }
                      if (!values.bankAccountType) {
                        errors.bankAccountType = 'Required';
                      }
                      if (!values.bankAccountName) {
                        errors.bankAccountName = 'Required';
                      }
                      if (!values.bankAccountNumber) {
                        errors.bankAccountNumber = 'Required';
                      }
                      if (!values.bankName) {
                        errors.bankName = 'Required';
                      }
                      if (!values.beneficiaryAddressStreet1) {
                        errors.beneficiaryAddressStreet1 = 'Required';
                      }
                      if (!values.beneficiaryAddressStreet2) {
                        errors.beneficiaryAddressStreet2 = 'Required';
                      }
                      if (!values.beneficiaryAddressRegion) {
                        errors.beneficiaryAddressRegion = 'Required';
                      }
                      if (!values.beneficiaryAddressCity) {
                        errors.beneficiaryAddressCity = 'Required';
                      }
                      if (!values.beneficiaryAddressPostalCode) {
                        errors.beneficiaryAddressPostalCode = 'Required';
                      }
                      if (!values.beneficiaryAddressCountry) {
                        errors.beneficiaryAddressCountry = 'Required';
                      }
                    }

                    if (!values.policy) {
                      errors.policy = 'You must accept with this policy.';
                    }
                    return errors;
                  }}
                  // validateOnBlur={false}
                  // validateOnChange={false}
                  onSubmit={(values, { setSubmitting }) => {
                    this.handleSubmit(values, setSubmitting);
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
                                      this.changeRedeemAmount(e, setFieldValue);
                                      return handleChange(e)
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
                              <div className="row container">
                                <div className="col">
                                  <div className="title">ENTER YOUR BANK</div>
                                  <div className="row">
                                    <div className="col-6 input">
                                      <TextField
                                        label="Routing Number"
                                        name="routingNumber"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.routingNumber}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.routingNumber && touched.routingNumber && <span className="c-error"><span>{errors.routingNumber}</span></span>}
                                    </div>
                                    <div className="col-4 input">
                                      <TextField
                                        label="Swift Code"
                                        name="swiftCode"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.swiftCode}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.swiftCode && touched.swiftCode && <span className="c-error"><span>{errors.swiftCode}</span></span>}
                                    </div>
                                    <div className="col-2 input">
                                      <FormControl variant="outlined" fullWidth style={{ marginTop: 20 }}>
                                        <InputLabel htmlFor="age-required">Ach Check Type</InputLabel>
                                        <Select
                                          value={values.achCheckType}
                                          onChange={(e) => {
                                            values.achCheckType = e.target.value
                                            this.setState({ isUpdated: true })
                                          }}
                                          name="achCheckType"
                                        >
                                          <MenuItem value={'personal'}>Personal</MenuItem>
                                          <MenuItem value={'business'}>Business</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    <div className="col-2 input">
                                      <FormControl variant="outlined" fullWidth style={{ marginTop: 20 }}>
                                        <InputLabel htmlFor="age-required">Bank Country</InputLabel>
                                        <Select
                                          value={values.bankCountry}
                                          onChange={(e) => {
                                            values.bankCountry = e.target.value
                                            this.setState({ isUpdated: true })
                                          }}
                                          name="bankCountry"
                                        >
                                          <MenuItem value={'US'}>US</MenuItem>
                                          <MenuItem value={'VN'}>VN</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    <div className="col-4 input">
                                      <TextField
                                        label="Bank Account Name"
                                        name="bankAccountName"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.bankAccountName}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.bankAccountName && touched.bankAccountName && <span className="c-error"><span>{errors.bankAccountName}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <FormControl variant="outlined" fullWidth style={{ marginTop: 20 }}>
                                        <InputLabel htmlFor="age-required">Bank Account Type</InputLabel>
                                        <Select
                                          value={values.bankAccountType}
                                          onChange={(e) => {
                                            values.bankAccountType = e.target.value
                                            this.setState({ isUpdated: true })
                                          }}
                                          name="bankAccountType"
                                        >
                                          <MenuItem value={'checking'}>Checking</MenuItem>
                                          <MenuItem value={'savings'}>Savings</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Bank Account Number"
                                        name="bankAccountNumber"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.bankAccountNumber}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.bankAccountNumber && touched.bankAccountNumber && <span className="c-error"><span>{errors.bankAccountNumber}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Bank Name"
                                        name="bankName"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.bankName}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.bankName && touched.bankName && <span className="c-error"><span>{errors.bankName}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Beneficiary Address Street 1"
                                        name="beneficiaryAddressStreet1"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.beneficiaryAddressStreet1}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.beneficiaryAddressStreet1 && touched.beneficiaryAddressStreet1 && <span className="c-error"><span>{errors.beneficiaryAddressStreet1}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Beneficiary Address Street 2"
                                        name="beneficiaryAddressStreet2"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.beneficiaryAddressStreet2}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.beneficiaryAddressStreet2 && touched.beneficiaryAddressStreet2 && <span className="c-error"><span>{errors.beneficiaryAddressStreet2}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Beneficiary Address Region"
                                        name="beneficiaryAddressRegion"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.beneficiaryAddressRegion}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.beneficiaryAddressRegion && touched.beneficiaryAddressRegion && <span className="c-error"><span>{errors.beneficiaryAddressRegion}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Beneficiary Address City"
                                        name="beneficiaryAddressCity"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.beneficiaryAddressCity}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.beneficiaryAddressCity && touched.beneficiaryAddressCity && <span className="c-error"><span>{errors.beneficiaryAddressCity}</span></span>}
                                    </div>
                                    <div className="col-6 input">
                                      <TextField
                                        label="Beneficiary Address PostalCode"
                                        name="beneficiaryAddressPostalCode"
                                        placeholder=""
                                        className="input-of-create cst"
                                        fullWidth
                                        value={values.beneficiaryAddressPostalCode}
                                        autoComplete="off"
                                        onChange={handleChange}
                                      />
                                      {errors.beneficiaryAddressPostalCode && touched.beneficiaryAddressPostalCode && <span className="c-error"><span>{errors.beneficiaryAddressPostalCode}</span></span>}
                                    </div>
                                    <div className="col-4 input">
                                      <FormControl variant="outlined" fullWidth style={{ marginTop: 20 }}>
                                        <InputLabel htmlFor="age-required">Beneficiary Address Country</InputLabel>
                                        <Select
                                          value={values.beneficiaryAddressCountry}
                                          onChange={(e) => {
                                            values.beneficiaryAddressCountry = e.target.value
                                            this.setState({ isUpdated: true })
                                          }}
                                          name="beneficiaryAddressCountry"
                                        >
                                          <MenuItem value={'US'}>US</MenuItem>
                                          <MenuItem value={'VN'}>VN</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                                <div className="row container">
                                  <div className="col">
                                    <div className="title">ENTER ETHER ADDRESS</div>
                                    <div className="row">
                                      <div className="col-8">
                                        <TextField
                                          name="receiverAddress"
                                          placeholder=""
                                          className="input-of-create cst"
                                          fullWidth
                                          value={values.receiverAddress}
                                          autoComplete="off"
                                          onChange={handleChange}
                                        />
                                        {errors.receiverAddress && touched.receiverAddress && <span className="c-error"><span>{errors.receiverAddress}</span></span>}
                                      </div>
                                      <div className="col-4">
                                        <TextField
                                          disabled={true}
                                          placeholder=""
                                          className="input-of-create cst"
                                          value={`${values.etherAmount} ETH`}
                                          autoComplete="off"
                                          fullWidth
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                          }
                          <div className="row" style={{ marginTop: 40 }}>
                            <div className="col-12"></div>
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
                                {isValid && isSubmitting ? <FontAwesomeIcon icon={faSpinnerThird} size="1x" spin style={{ marginRight: 10 }} /> : ''}
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
