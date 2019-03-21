import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import Link from "components/Link";

import { createAndSignMetadata } from "../../services/oracle";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class RequestCreate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pubkeys: "",
      openDialog: false,
      resultMessage: "",
      isSubmitting: false,
    }
  }
  onChangePubkey = (pubkeys = "") => {
    this.setState({pubkeys});
  }
  onSubmit = async () => {
    const {pubkeys=""} = this.state;
    if (!pubkeys) return;
    this.setState({isSubmitting: true})
    const res = await createAndSignMetadata(pubkeys);
    const {result, error} = res;
    let resultMessage;
    if (error) {
      console.log(error)
      resultMessage = error;
    }
    if (result || result === true) {
      resultMessage = "Successfully";
    }
    this.setState({resultMessage, openDialog: true, isSubmitting : false})
  }
  onCloseDialog = () => {
    this.setState({openDialog: false, resultMessage: ""})
  }
  render() {
    const {pubkeys, openDialog, isSubmitting} = this.state;
    const isDisableButton = isSubmitting === true;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="row">
                  <div className="hello">
                    Request Create
                  </div>
                </div>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}} >
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
                      onChange={(e)=>this.onChangePubkey(e.target.value)}
                      value={pubkeys}
                    />
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                <FormControl component="fieldset" >
                  <button className="c-btn c-btn-primary submit"  style={{width: "100%"}} onClick={this.onSubmit} disabled={isDisableButton ? true: false} >
                    Submit
                  </button>
                </FormControl>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestCreate)
