import React from "react";
// import PropTypes from "prop-types";
import {connect} from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText, FormLabel,
} from '@material-ui/core';

// import Link from "components/Link";

import {getAssets, feedPrice, checkIsUserInBoard, getFeedPriceHistory} from "../../services/oracle";
import {formatConstantValue} from "../../services/formatter";

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

class FeedPrice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asset: "",
      assets: [],
      openDialog: false,
      resultMessage: "",
      price: "",
      isUserInBoard: false,
      history: [],
      historyPagination: {Page: 1, Limit: 10, TotalRecord: 0, TotalPage: 0},
    }
  }

  componentDidMount() {
    this.onGetAssets();

    this.onCheckUserIsInBoard();
    this.onGetHistory();
  }

  onChangeAsset = (asset) => {
    this.setState({asset})
  }
  onGetAssets = async () => {
    const {accessToken} = this.props
    const res = await getAssets(accessToken);
    const {Result = [], Error} = res.data;
    if (Error) {
      console.log(Error);
    } else {
      this.setState({assets: Result})
    }
  }
  onCloseDialog = () => {
    this.setState({openDialog: false, resultMessage: ""})
  }
  onPriceChange = (price) => {
    this.setState({price})
  }
  onSubmit = async () => {
    const {accessToken} = this.props;
    const {asset = "", price} = this.state;
    if (!asset) return;
    if (!price || isNaN(price)) return;
    this.setState({isSubmitting: true})
    const res = await feedPrice(accessToken, parseFloat(price) * 100, asset);
    const {Result, Error} = res.data;
    let resultMessage;
    if (Error) {
      console.log(Error)
      resultMessage = Error;
    }
    if (Result || Result === true) {
      resultMessage = "Successfully";
      setTimeout(() => {
        window.location.reload();
      }, 200)
    }
    this.setState({resultMessage, openDialog: true, isSubmitting: false})
  }

  onCheckUserIsInBoard = async () => {
    const {accessToken} = this.props
    const res = await checkIsUserInBoard(accessToken)
    const {Result, Error} = res.data;
    if (Error) {
      console.log(Error);
    }
    if (Result || Result === true) {
      this.setState({
        isUserInBoard: true,
      })
    }
  }

  onGetHistory = async (perPage, page) => {
    const {accessToken} = this.props;
    const res = await getFeedPriceHistory(accessToken, perPage, page);
    // console.log(res)
    const {Result = [], Error = ""} = res.data;
    if (Error) {
      console.log("get history error", Error);
      return;
    }
    let {Records = [], ...pagination} = Result;
    if (Records === null) Records = [];
    this.setState({history: Records, historyPagination: pagination});
  }
  onChangeHistoryPage = (page) => {
    const {historyPagination} = this.state;
    const {Limit = 10} = historyPagination;
    this.onGetHistory(Limit, page + 1);
  }
  onChangeHistoryRowsPerPage = (perPage) => {
    this.onGetHistory(perPage, 1);
  }

  render() {
    const {assets = [], openDialog, isSubmitting, isUserInBoard, history = [], historyPagination = {}} = this.state;
    const isDisableBtn = isSubmitting === true;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="row">
                  <div className="hello">
                    Feed Price
                  </div>
                </div>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <FormLabel component="legend" className="title">Currency</FormLabel>
                    <Select
                      value={this.state.asset}
                      onChange={(e) => this.onChangeAsset(e.target.value)}
                      inputProps={{
                        name: 'asset',
                        id: 'asset',
                      }}
                    >
                      {assets && assets.length > 0 && assets.map((item = {}, i) => {
                        return (
                          <MenuItem key={`asset-${i}`} value={item.Asset}>{item.Name}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}}>
                    <FormLabel component="legend" className="title">Price(USD)</FormLabel>
                    <TextField
                      id="price"
                      className="input-of-create cst"
                      type="number"
                      style={{
                        lineHeight: "2em",
                      }}
                      fullWidth
                      InputProps={{
                        style: {paddingTop: 0, paddingBottom: 0, height: "inherit !important"},
                      }}
                      onChange={(e) => this.onPriceChange(e.target.value)}
                      value={this.state.price}
                      addonAfter={"USD"}
                    />
                  </FormControl>
                </div>
                <br/>
                {isUserInBoard ?
                  <div className="row" style={{justifyContent: "flex-end"}}>
                    <FormControl component="fieldset">
                      <button className="c-btn c-btn-primary submit" style={{width: "100%"}}
                              disabled={isDisableBtn ? true : false} onClick={this.onSubmit}>
                        Submit
                      </button>
                    </FormControl>
                  </div>
                  : ""}

                {history.length > 0 ?
                  <div className="row">
                    <div className="col-12" style={{marginTop: 30}}>
                      <div className="hello">
                        History
                      </div>
                      <table className="c-table-portal-home"
                             style={{minWidth: "100%", fontSize: "14px", fontWeight: 500}}>
                        <thead>
                        <tr>
                          <th>Currency</th>
                          <th>Price</th>
                          <th>Created At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          history && history.map((item = {}) => {
                            return (
                              <tr key={`history-${item.ID}`}>
                                <td>{item.AssetType}</td>
                                <td>{formatConstantValue(item.Price / 100)} USD</td>
                                <td>{item.CreatedAt ? dayjs(item.CreatedAt).format('MM-DD-YYYY HH:mm:ss') : ""}</td>
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                      {history.length > 0 && historyPagination && Object.keys(historyPagination).length > 0 ?
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={3}
                          count={historyPagination.TotalRecord}
                          rowsPerPage={historyPagination.Limit}
                          page={historyPagination.Page - 1}
                          SelectProps={{
                            // native: true,
                          }}
                          onChangePage={(e, p) => this.onChangeHistoryPage(p)}
                          onChangeRowsPerPage={(e) => this.onChangeHistoryRowsPerPage(e.target.value)}
                          // ActionsComponent={TablePaginationActionsWrapped}
                        />
                        : ""}
                    </div>
                  </div>
                  : ""}

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

export default connect(mapStateToProps, mapDispatchToProps)(FeedPrice)
