import React from "react";
// import PropTypes from "prop-types";
import {connect} from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  // TablePagination,
  FormControl,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

// import Link from "components/Link";

import {signMetadata, checkIsUserInBoard, getMetadataDetail} from "../../services/oracle";

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

class RequestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserInBoard: false,
      openDialog: false,
      resultMessage: "",
      isSubmitting: false,
      metadata: {},
    }
  }

  componentDidMount() {
    const {accessToken} = this.props;
    checkIsUserInBoard(accessToken).then((res = {}) => {
      const {Result, Error} = res.data;
      if (Error) {
        console.log(Error);
      }
      if (Result || Result === true) {
        this.setState({
          isUserInBoard: true,
        })
      }
    })
    const {match = {}} = this.props;
    const {params} = match;
    const {id = ""} = params;
    if (!id) return;
    this.onGetMetadata(id);
  }

  onGetMetadata = async (id) => {
    const {accessToken} = this.props
    const res = await getMetadataDetail(accessToken, id);
    const {Result = {}, Error} = res.data;
    if (Error) {
      console.log(Error);
    } else {
      this.setState({metadata: Result})
    }
  }
  onSubmit = async () => {
    const {match = {}, accessToken} = this.props;
    const {params} = match;
    const {id = ""} = params;
    if (!id) return;
    this.setState({isSubmitting: true})
    const res = await signMetadata(accessToken, id);
    const {Result, Error} = res.data;
    let resultMessage;
    if (Error) {
      console.log(Error)
      resultMessage = Error;
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

  render() {
    const {isUserInBoard, openDialog, metadata = {}} = this.state;

    let showSubmitBtn = (metadata.Status !== "submitted" && isUserInBoard && metadata.IsSign !== true);
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
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <div className="title">PUBLIC KEYS</div>
                    {
                      metadata.PubKeys && metadata.PubKeys.length > 0 && metadata.PubKeys.map((key, i) => {
                        return (
                          <TextField
                            key={`pubkey=${i}`}
                            id="amount"
                            className="input-of-create cst"
                            type="text"
                            style={{
                              lineHeight: "2em",
                            }}
                            fullWidth
                            InputProps={{
                              style: {paddingTop: 10, paddingBottom: 10, height: "inherit !important"},
                            }}
                            // onChange={(e)=>this.onAmountChange(e.target.value)}
                            value={key}
                            disabled
                          />
                        )
                      })
                    }
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <div className="title">BIO</div>
                    <TextField
                      id="bio"
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
                          minHeight: 250
                        },
                      }}
                      value={metadata.Bio}
                      disabled
                      variant="outlined"
                    />
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <div className="title">Created
                      At: {metadata.CreatedAt ? dayjs(metadata.CreatedAt).format('MM-DD-YYYY') : ""}</div>
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  {showSubmitBtn ?
                    <FormControl component="fieldset">
                      <button className="c-btn c-btn-primary submit" style={{width: "100%"}} onClick={this.onSubmit}>
                        Sign
                      </button>
                    </FormControl>
                    : ""}
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetail)
