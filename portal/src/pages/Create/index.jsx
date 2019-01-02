import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@/components/Link';
import { axios } from '@/services/api';
import rawAxios from 'axios';
import { API } from '@/constants';
import dayjs from 'dayjs';
import { Formik } from 'formik';

class Create extends React.Component {
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
      disabledBTC: false,
      price: {
        btc: 1,
        eth: 1,
      },
      collateralAmountPlaceholder: '100',
    };

    axios.get(API.LOAN_PARAMS).then(res => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result && Result.length) {
          console.log(Result);
          const currentRate = Result[0];
          this.setState({ rates: Result, currentRate });
          this.calcMaturity(currentRate);
          return;
        }
      }
    });

    this.getTickerOfBTC();
    this.getTickerOfETH();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

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
  }

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

  changeLoanAmount = (e, setFieldValue) => {
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
    this.setState({ collateralAmountPlaceholder: collateralAmount || '100' });
  }

  inputChange = (handleChange, setFieldTouched, name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  }

  handleSubmit = (values, setSubmitting) => {
    console.log(values);
  }

  submitByETH = () => {

  }

  render() {
    const { collaterals, currentCollateral, rates, currentRate, maturity, disabledBTC, collateralAmountPlaceholder } = this.state;

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
                  initialValues={{ loanAmount: '', collateralAmount: '', secretKey: '', policy: false }}
                  validate={values => {
                    let errors = {};
                    if (!values.loanAmount) {
                      errors.loanAmount = 'Required';
                    }
                    if (!values.collateralAmount) {
                      errors.collateralAmount = 'Required';
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
                  validateOnChange={false}
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
                  }) => (
                      <form onSubmit={handleSubmit}>
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
                                  <div key={collateral.name} className={`collateral-option ${currentCollateral.name === collateral.name ? 'active' : ''}`} onClick={() => { if (disabledBTC && collateral.name === 'BTC') return; this.setState({ currentCollateral: collateral }, () => { this.changeLoanAmount({ target: { value: values.loanAmount } }, setFieldValue); }); }}>
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
                                  onChange={(e) => { this.changeLoanAmount(e, setFieldValue); this.inputChange(handleChange, setFieldTouched, "loanAmount", e); }}
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
                                  onChange={this.inputChange.bind(null, handleChange, setFieldTouched, "collateralAmount")}
                                  InputProps={{
                                    endAdornment: <InputAdornment position="end">{currentCollateral.name}</InputAdornment>,
                                  }}
                                />
                                {errors.collateralAmount && touched.collateralAmount && <span className="c-error"><span>{errors.collateralAmount}</span></span>}
                                <div>Collateral amount based on a 35% Loan to Value (LTV).</div>
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
                                  onChange={this.inputChange.bind(null, handleChange, setFieldTouched, "secretKey")}
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
                                  <div key={rate.InterestRate} className={`rate ${rate.InterestRate === currentRate.InterestRate ? 'active' : ''}`} onClick={() => { this.setState({ currentRate: rate }); this.calcMaturity(rate); }}>{rate.InterestRate}%</div>
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
                              <button className="c-btn c-btn-primary submit" type="submit">Submit <FontAwesomeIcon icon={faArrowRight} /></button>
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

export default Create;
