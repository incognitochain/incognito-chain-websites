import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
} from '@material-ui/core';

import Link from "components/Link";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class RequestDetail extends React.Component {
  render() {
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="row">
                  <div className="hello">
                    Request Detail
                  </div>
                </div>

                <div className="row">
                  <FormControl component="fieldset" >
                    <div className="title">PAYMENT ADDRESS</div>
                    <TextField
                      id="amount"
                      className="input-of-create cst"
                      type="text"
                      style={{
                        lineHeight: "2em",
                      }}
                      fullWidth
                      InputProps={{
                        style: {paddingTop: 10, paddingBottom: 10, height:"inherit !important"},
                      }}
                      // onChange={(e)=>this.onAmountChange(e.target.value)}
                      value={"abccccccccc"}
                      disabled
                    />
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                <FormControl component="fieldset" >
                  <button className="c-btn c-btn-primary submit"  style={{width: "100%"}} >
                    Submit
                  </button>
                </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetail)
