import React from "react";
// import PropTypes from "prop-types";
import {connect} from "react-redux";
// import dayjs from 'dayjs';

import {
  TextField,
  // TablePagination,
  FormControl,
  Dialog,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem, FormLabel,
} from '@material-ui/core';

// import Link from "components/Link";

import {ORACLE_REQUEST_ACTION} from "../../constants";
import {createAndSignMetadata} from "../../services/oracle";

const requestActionItems = [
  {label: "Add", value: ORACLE_REQUEST_ACTION.ADD},
  {label: "Remove", value: ORACLE_REQUEST_ACTION.REMOVE},
];

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

class RequestCreate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pubkeys: "",
      openDialog: false,
      resultMessage: "",
      isSubmitting: false,
      action: 1,
      bio: "",
    }
  }

  onChangePubkey = (pubkeys = "") => {
    this.setState({pubkeys});
  }
  onSubmit = async () => {
    const {accessToken} = this.props
    const {pubkeys = "", action = "", bio = ""} = this.state;
    const pubkeyArr = pubkeys.split(",") || [];
    if (!pubkeys || pubkeyArr.length <= 0 || !action) return;

    this.setState({isSubmitting: true})
    const res = await createAndSignMetadata(accessToken, pubkeyArr, action, bio);
    const {Result, Error} = res.data;
    let resultMessage;
    if (Error) {
      console.log(Error)
      resultMessage = Error.Message;
    }
    if (Result || Result === true) {
      resultMessage = "Successfully";
      setTimeout(() => {
        window.location = "/oracle";
      }, 200)
    }
    this.setState({resultMessage, openDialog: true, isSubmitting: false})
  }
  onCloseDialog = () => {
    this.setState({openDialog: false, resultMessage: ""})
  }
  onChangeAction = (action) => {
    this.setState({action});
  }
  onChangeBio = (bio) => {
    this.setState({bio});
  }

  render() {
    const {pubkeys, openDialog, isSubmitting, bio = ""} = this.state;
    const isDisableButton = isSubmitting === true;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="row">
                  <div className="hello">
                    Make New Suggestion
                  </div>
                </div>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <FormLabel component="legend" className="title">Nominee's Public keys</FormLabel>
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
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <FormLabel component="legend" className="title">Bio of Proponent</FormLabel>
                    <TextField
                      id="bio"
                      multiline
                      className="input-of-create cst"
                      type="text"
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
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <FormLabel component="legend" className="title">Suggestion Action</FormLabel>
                    <Select
                      value={this.state.action}
                      onChange={(e) => this.onChangeAction(e.target.value)}
                      inputProps={{
                        name: 'asset',
                        id: 'asset',
                      }}
                    >
                      {requestActionItems.map((item = {}, i) => {
                        return (
                          <MenuItem selected={i == 0 ? true : false} key={`asset-${i}`}
                                    value={item.value}>{item.label}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <br/>
                <div className="row" style={{justifyContent: "flex-end"}}>
                  <FormControl component="fieldset">
                    <button className="c-btn c-btn-primary submit" style={{width: "100%"}} onClick={this.onSubmit}
                            disabled={isDisableButton ? true : false}>
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
