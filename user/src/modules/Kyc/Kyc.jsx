import React from "react";
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { axios, catchError } from "services/api";
import { API } from "constants/index";
import { isEmpty } from "lodash";
import { Dialog, toaster, TextInputField, Alert } from "evergreen-ui";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { faSpinnerThird } from '@fortawesome/pro-light-svg-icons';
import { Formik } from 'formik';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

class Kyc extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      gender: 1,
      isUploading: false,
      isUpdated: false,
      data: null,
      kycDocs: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios.get(`${API.AUTH_KYC}`, null).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          this.setState({ data: res.data.Result })
          return
        }
      }
      this.setState({ data: {} })
    }).catch((e) => {
      this.setState({ data: {} })
      console.log(e);
      catchError(e);
    });
    axios.get(`${API.STORAGE_KYC_DOCUMENTS}`, null).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          this.setState({ kycDocs: res.data.Result })
          return
        }
      }
      this.setState({ kycDocs: {} })
    }).catch((e) => {
      this.setState({ kycDocs: {} })
      console.log(e);
      catchError(e);
    });
  }

  handleSubmit = (values, setSubmitting) => {
    console.log(values)
    return true;
  }

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  };

  onImageFileChanged = (type, file) => {
    const { kycDocs } = this.state
    this.setState({ isUploading: true })
    const data = new FormData()
    data.append('file', file, file.name)
    data.append('type', type)
    axios.post(`${API.STORAGE_UPLOAD}`, data).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          kycDocs[type] = res.data.Result
          this.setState({ kycDocs: kycDocs })
        }
      }
      this.setState({ isUploading: false })
    }).catch((e) => {
      toaster.warning('Failed to upload');
      console.log(e);
      catchError(e);
      this.setState({ isUploading: false })
    });
  }

  handleSubmit = (values, setSubmitting) => {
    setSubmitting(true)
    const data = {
      fullName: values.fullName,
      dob: values.dob,
      gender: parseInt(values.gender, 0),
      taxCountry: values.taxCountry,
      taxIDNumber: values.taxIDNumber,
      addressStreet1: values.addressStreet1,
      addressStreet2: values.addressStreet2,
      addressRegion: values.addressRegion,
      addressCity: values.addressCity,
      addressPostalCode: values.addressPostalCode,
      addressCountry: values.addressCountry,
      phoneNumber: values.phoneNumber,
      phoneCountryCode: values.phoneCountryCode,
    };
    axios.post(`${API.AUTH_KYC}`, data).then((res) => {
      if (res.status === 200) {
        if (res.data && res.data.Result) {
          toaster.success('Successed to update your KYC');
        }
      }
      setSubmitting(false)
    }).catch((e) => {
      toaster.warning('Failed to update your KYC');
      console.log(e);
      catchError(e);
      setSubmitting(false)
    });
    return true;
  }

  render() {
    const {
      data, kycDocs
    } = this.state;
    if (data == null) {
      return (
        <div></div>
      )
    }
    return (
      <Formik
        initialValues={{
          fullName: data.FullName ? data.FullName : '',
          dob: data.DOB ? data.DOB : '2001-01-01',
          gender: data.Gender ? data.Gender : 1,
          taxCountry: data.TaxCountry ? data.TaxCountry : 'VN',
          taxIDNumber: data.TaxIDNumber ? data.TaxIDNumber : '',
          taxImage1: '',
          taxImage2: '',
          taxImage3: '',
          addressStreet1: data.AddressStreet1 ? data.AddressStreet1 : '',
          addressStreet2: data.AddressStreet2 ? data.AddressStreet2 : '',
          addressRegion: data.AddressRegion ? data.AddressRegion : '',
          addressCity: data.AddressCity ? data.AddressCity : '',
          addressPostalCode: data.AddressPostalCode ? data.AddressPostalCode : '',
          addressCountry: data.AddressCountry ? data.AddressCountry : '',
          phoneNumber: data.PhoneNumber ? data.PhoneNumber : '',
          phoneCountryCode: data.PhoneCountryCode ? data.PhoneCountryCode : '+84',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.fullName) {
            errors.fullName = 'Required';
          }
          if (!values.taxIDNumber) {
            errors.taxIDNumber = 'Required';
          }
          if (!values.dob) {
            errors.dob = 'Required';
          }
          if (!values.addressStreet1) {
            errors.addressStreet1 = 'Required';
          }
          if (!values.addressStreet2) {
            errors.addressStreet2 = 'Required';
          }
          if (!values.addressRegion) {
            errors.addressRegion = 'Required';
          }
          if (!values.addressCity) {
            errors.addressCity = 'Required';
          }
          if (!values.addressPostalCode) {
            errors.addressPostalCode = 'Required';
          }
          if (!values.addressCountry) {
            errors.addressCountry = 'Required';
          }
          if (!values.phoneNumber) {
            errors.phoneNumber = 'Required';
          }
          if (!values.phoneCountryCode) {
            errors.phoneCountryCode = 'Required';
          }
          return errors;
        }}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting }) => {
          this.handleSubmit(values, setSubmitting);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            isValid,
            status,
          } = props;
          return (
            <form onSubmit={handleSubmit} autoComplete="off">
              <Dialog
                isShown={(isValid && isSubmitting) || this.state.isUploading}
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
              <div className="container" style={{ marginTop: 40 }}>
                <div className="row">
                  <div className="col">
                    <React.Fragment>
                      <Typography variant="h6" gutterBottom>
                        KYC INFOMATION
                      </Typography>
                      <Grid container spacing={24}>
                        <Grid item xs={6}>
                          <Grid item xs={12}>
                            <TextField
                              id="fullName"
                              label="Full Name"
                              fullWidth
                              name="fullName"
                              value={values.fullName}
                              autoComplete="off"
                              onChange={handleChange}
                            />
                            {errors.fullName && touched.fullName && <span className="c-error"><span>{errors.fullName}</span></span>}
                          </Grid>
                        </Grid>
                        <Grid item xs={3}>
                          <FormControlLabel value="1" control={
                            <Radio
                              checked={values.gender == 1}
                              onChange={(e) => {
                                values.gender = e.target.value
                                this.setState({ isUpdated: true })
                              }}
                              value="1"
                              name="radio-button-demo"
                              aria-label="A"
                            />
                          } label="Male" />
                          <FormControlLabel value="0" control={
                            <Radio
                              checked={values.gender == 2}
                              onChange={(e) => {
                                values.gender = e.target.value
                                this.setState({ isUpdated: true })
                              }}
                              value="2"
                              name="radio-button-demo"
                              aria-label="A"
                            />
                          } label="Female" />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            id="dob"
                            label="Date Of Birth"
                            type="date"
                            value={values.dob}
                            onChange={handleChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          {errors.dob && touched.dob && <span className="c-error"><span>{errors.dob}</span></span>}
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel
                              ref={ref => {
                                this.InputLabelRef = ref;
                              }}
                              htmlFor="outlined-taxCountry"
                            >
                              Tax Country
                            </InputLabel>
                            <Select
                              value={values.taxCountry}
                              onChange={(e) => {
                                values.taxCountry = e.target.value
                                this.setState({ isUpdated: true })
                              }}
                              input={
                                <OutlinedInput
                                  name="taxCountry"
                                  labelWidth={90}
                                  id="outlined-taxCountry"
                                />
                              }
                            >
                              <MenuItem value={'US'}>US</MenuItem>
                              <MenuItem value={'VN'}>VN</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            id="taxIDNumber"
                            label="Tax ID Number"
                            value={values.taxIDNumber}
                            helperText=""
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.taxIDNumber && touched.taxIDNumber && <span className="c-error"><span>{errors.taxIDNumber}</span></span>}
                        </Grid>
                        <Grid item xs={2}>
                          GOV ID Front
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            accept="image/*"
                            id="taxImage1"
                            type="file"
                            onChange={(e) => {
                              this.onImageFileChanged('government_id_front', e.target.files[0])
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          {
                            kycDocs && kycDocs.government_id_front ?
                              (
                                <Checkbox
                                  checked={true}
                                  onChange={handleChange}
                                  value="1"
                                  color="primary"
                                />
                              ) : null
                          }
                        </Grid>
                        <Grid item xs={2}>
                          GOV ID Back
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            accept="image/*"
                            id="taxImage2"
                            type="file"
                            onChange={(e) => {
                              this.onImageFileChanged('government_id_back', e.target.files[0])
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          {
                            kycDocs && kycDocs.government_id_back ?
                              (
                                <Checkbox
                                  checked={true}
                                  onChange={handleChange}
                                  value="1"
                                  color="primary"
                                />
                              ) : null
                          }
                        </Grid>
                        <Grid item xs={2}>
                          Proof Of Address
                        </Grid>
                        <Grid item xs={3}>
                          <input
                            accept="image/*"
                            id="taxImage3"
                            type="file"
                            onChange={(e) => {
                              this.onImageFileChanged('proof_of_address', e.target.files[0])
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          {
                            kycDocs && kycDocs.proof_of_address ?
                              (
                                <Checkbox
                                  checked={true}
                                  onChange={handleChange}
                                  value="1"
                                  color="primary"
                                />
                              ) : null
                          }
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="addressStreet1"
                            label="AddressStreet1"
                            helperText=""
                            value={values.addressStreet1}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.addressStreet1 && touched.addressStreet1 && <span className="c-error"><span>{errors.addressStreet1}</span></span>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="addressStreet2"
                            label="AddressStreet2"
                            helperText=""
                            value={values.addressStreet2}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.addressStreet2 && touched.addressStreet2 && <span className="c-error"><span>{errors.addressStreet2}</span></span>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="addressRegion"
                            label="AddressRegion"
                            helperText=""
                            value={values.addressRegion}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.addressRegion && touched.addressRegion && <span className="c-error"><span>{errors.addressRegion}</span></span>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="addressCity"
                            label="AddressCity"
                            helperText=""
                            value={values.addressCity}
                            fullWidth
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="addressPostalCode"
                            label="AddressPostalCode"
                            helperText=""
                            value={values.addressPostalCode}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.addressPostalCode && touched.addressPostalCode && <span className="c-error"><span>{errors.addressPostalCode}</span></span>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            id="addressCountry"
                            label="AddressCountry"
                            helperText=""
                            value={values.addressCountry}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.addressCountry && touched.addressCountry && <span className="c-error"><span>{errors.addressCountry}</span></span>}
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel
                              ref={ref => {
                                this.InputLabelRef = ref;
                              }}
                              htmlFor="outlined-phoneCountryCode"
                            >
                              Country Code
                            </InputLabel>
                            <Select
                              value={values.phoneCountryCode}
                              style={{ minHeight: 55 }}
                              onChange={(e) => {
                                values.phoneCountryCode = e.target.value
                                this.setState({ isUpdated: true })
                              }}
                              input={
                                <OutlinedInput
                                  name="phoneCountryCode"
                                  labelWidth={90}
                                  id="outlined-phoneCountryCode"
                                />
                              }
                            >
                              <MenuItem value={'+1'}>+1</MenuItem>
                              <MenuItem value={'+84'}>+84</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            id="phoneNumber"
                            label="Phone Number"
                            helperText=""
                            value={values.phoneNumber}
                            fullWidth
                            onChange={handleChange}
                          />
                          {errors.phoneNumber && touched.phoneNumber && <span className="c-error"><span>{errors.phoneNumber}</span></span>}
                        </Grid>
                        <Grid item xs={12}>
                          <button className="c-btn c-btn-primary submit" type="submit" disabled={isValid && isSubmitting}>
                            {isValid && isSubmitting ? <FontAwesomeIcon icon={faSpinnerThird} size="1x" spin style={{ marginRight: 10 }} /> : ''}
                            {'Submit '}
                            <FontAwesomeIcon icon={faArrowRight} />
                          </button>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  </div>
                </div>
              </div >
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default Kyc;
