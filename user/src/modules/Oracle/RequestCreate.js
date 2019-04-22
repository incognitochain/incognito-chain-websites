import React from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
// import dayjs from 'dayjs';

import {
  TextField,
  // TablePagination,
  FormControl,
  Dialog,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
} from '@material-ui/core';

// import Link from "components/Link";

import { ORACLE_REQUEST_ACTION } from "../../constants";
import { createAndSignMetadata } from "../../services/oracle";

const requestActionItems = [
  { label: "Add", value: ORACLE_REQUEST_ACTION.ADD },
  { label: "Remove", value: ORACLE_REQUEST_ACTION.REMOVE },
];

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class RequestCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pubkeys: "",
      openDialog: false,
      resultMessage: "",
      isSubmitting: false,
      action: "",
      bio: "",
    }
  }
  onChangePubkey = (pubkeys = "") => {
    this.setState({ pubkeys });
  }
  onSubmit = async () => {
    const { pubkeys = "", action = "", bio = "" } = this.state;
    const pubkeyArr = pubkeys.split(",") || [];
    if (!pubkeys || pubkeyArr.length <= 0 || !action) return;

    this.setState({ isSubmitting: true })
    const res = await createAndSignMetadata(pubkeyArr, action, bio);
    const { result, error } = res;
    let resultMessage;
    if (error) {
      console.log(error)
      resultMessage = error;
    }
    if (result || result === true) {
      resultMessage = "Successfully";
      setTimeout(() => {
        window.location = "/oracle";
      }, 200)
    }
    this.setState({ resultMessage, openDialog: true, isSubmitting: false })
  }
  onCloseDialog = () => {
    this.setState({ openDialog: false, resultMessage: "" })
  }
  onChangeAction = (action) => {
    this.setState({ action });
  }
  onChangeBio = (bio) => {
    this.setState({ bio });
  }
  render() {
    const { pubkeys, openDialog, isSubmitting, bio = "" } = this.state;
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
                  <FormControl component="fieldset" style={{ width: "100%" }} >
                    <div className="title">PUBLIC KEYS</div>
                    <TextField
                      id="amount"
                      multiline
                      className="input-of-create cst"
                      type="text"
                      style={{
                        lineHeight: "2em",
                      }}
                      fullWidth
                      InputProps={{
                        style: {
                          paddingTop: 10, paddingBottom: 10, display: "block",
                          minHeight: 150
                        },
                      }}
                      onChange={(e) => this.onChangePubkey(e.target.value)}
                      value={pubkeys}
                      variant="outlined"
                    />
                  </FormControl>
                </div>
                <br />
                <div className="row">
                  <FormControl component="fieldset" style={{ width: "100%" }} >
                    <div className="title">Bio</div>
                    <TextField
                      id="bio"
                      multiline
                      className="input-of-create cst"
                      type="text"
                      style={{
                        // lineHeight: "2em",
                      }}
                      fullWidth
                      InputProps={{
                        style: {
                          paddingTop: 10, paddingBottom: 10, display: "block",
                          minHeight: 250
                        },
                      }}
                      onChange={(e) => this.onChangeBio(e.target.value)}
                      value={bio}
                      variant="outlined"
                    />
                  </FormControl>
                </div>
                <br />
                <div className="row">
                  <FormControl component="fieldset" style={{ width: "100%" }} >
                    <div className="title">ASSETS</div>
                    <Select
                      value={this.state.action}
                      onChange={(e) => this.onChangeAction(e.target.value)}
                      inputProps={{
                        name: 'asset',
                        id: 'asset',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {requestActionItems.map((item = {}, i) => {
                        return (
                          <MenuItem key={`asset-${i}`} value={item.value}>{item.label}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <br />
                <div className="row">
                  <FormControl component="fieldset" >
                    <button className="c-btn c-btn-primary submit" style={{ width: "100%" }} onClick={this.onSubmit} disabled={isDisableButton ? true : false} >
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
