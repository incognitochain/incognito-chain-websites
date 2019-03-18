import React from 'react';
import dayjs from 'dayjs';

import {
  TextField,
  FormControl,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  InputAdornment,
  InputLabel,
  // Table,
  // TableBody,
  // TableFooter,
  // TableRow,
  // TablePagination,
} from '@material-ui/core';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import Link from '@/components/Link';
// import Logo from '@/assets/logo.svg';
import bgImage from '@/assets/create-a-proposal.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from '@/components/Link';

import {BUYING_ASSET, RESERVE_HISTORY_STATUS_COLOR} from '../../constants';
import { buyAsset, getHistory, getPurchaseUSDStatistic } from "../../services/reserveAsset";

class BuyToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSummitting: false,
      openDialog: false,
      resultMessage: "",
      history: [],
      page:1,
      perPage: 10,
      purchaseStats: {},
    };
  }
  componentDidMount() {
    this.onGetHistory();
    this.onGetStats();
  }

  onAmountChange = (amount) => {
      this.setState({
        amount,
      });
  }

  onSubmit = async () => {
    const {amount} = this.state;
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    let resultMessage;
    this.setState({isSummitting: true});
    const result = await buyAsset(BUYING_ASSET.CONSTANT, amount*100);
    this.setState({isSummitting: false});
    const {error=""} = result;
    // console.log(result);
    if (error) {
      resultMessage = error;
    } else {
      resultMessage = "Buy Constant Successful";
    }
    this.setState({resultMessage, openDialog:true});
  }

  onCloseDialog = () => {
    this.setState({openDialog:false, resultMessage: ""});
  }

  onGetHistory = async () => {
    const {page, perPage} = this.state;
    const res = await getHistory(BUYING_ASSET.CONSTANT, perPage, page);
    const {result = [], error=""} = res;
    if (error) {
      console.log("get history error", error);
      return;
    }
    this.setState({ history: result });
  }

  onGetStats = async () => {
    const res = await getPurchaseUSDStatistic();
    // console.log(res)
    const {result = {}, error=""} = res;
    if (error) {
      console.log("get stats error", error);
      return;
    }
    this.setState({ purchaseStats: result });
  }

  // onChangeRowsPerPage = (perPage) => {
  //   // console.log(perPage)
  //   const {page} = this.state;
  //   this.setState({perPage});
  //   this.onGetHistory(page, perPage);
  // }
  // onChangePage = (page) => {
  //   console.log(page)
  //   if( page === 0) {
  //     return;
  //   }
  //   const {perPage} = this.state;
  //   this.setState({page})
  //   this.onGetHistory(page, perPage);
  // }

  render = () => {
    const {amount = "", isSummitting, openDialog, history = [], page, perPage, purchaseStats = {} } = this.state;
    const {TotalReservesSuccess = {}, TotalReservesFailed = {}, TotalAmountSuccess = {}, TotalAmountFailed = {}} = purchaseStats;
    return (
      <div className="home-page">
      <section >
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-8">
              <div className="c-card">
                <div className="hello">
                  Buy Constant
                </div>
                <div className="row stats-container" style={{display: "flex", justifyContent: "center"}}>

                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      { TotalReservesSuccess.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      {TotalReservesSuccess.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div>Reserve Success</div>
                  </div>

                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      { TotalReservesFailed.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      { TotalReservesFailed.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div>Reserve Failed</div>
                  </div>

                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      { TotalAmountSuccess.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      {TotalAmountSuccess.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div>Total Amount Success</div>
                  </div>

                  <div className="col-12 col-lg-3 stats">
                    <div className="value">
                      { TotalAmountFailed.usd || 0}
                      &nbsp;
                      <sup>USD</sup>
                    </div>
                    <div className="value">
                      { TotalAmountFailed.eth || 0}
                      &nbsp;
                      <sup>ETH</sup>
                    </div>
                    <div>Total Amount Failed</div>
                  </div>

                </div>
              </div>

              <div className="c-card">
                <FormControl component="fieldset" style={{width: "100%"}} >
                  <InputLabel htmlFor="amount" shrink style={{fontSize: 20}}>Amount</InputLabel>
                  <TextField
                    id="amount"
                    className="input-of-create cst"
                    // label="Label"
                    type="number"
                    // style={{ margin: 8 }}
                    // placeholder="Amount"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      style: {marginTop: 10, marginBottom: 10},
                    }}
                    onChange={(e)=>this.onAmountChange(e.target.value)}
                    value={amount}
                  />
                  <br/>
                  {
                    isSummitting ?
                      <div style={{display: "flex", justifyContent:"center"}}>
                        <CircularProgress style={{width: "auto", height:"auto"}} />
                      </div>
                    :
                      <button className="c-btn c-btn-primary submit" style={{width: "100%"}} onClick={this.onSubmit} >
                        Get Constant
                        &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                      </button>
                  }

                </FormControl>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 170, backgroundSize: "100%" }}>
                </div>
            </div>
          </div>
        </div>
        <Dialog
          open={openDialog}
          onClose={this.onCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText>
              {this.state.resultMessage}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </section>

      <div className="borrows-container" style={{ display: 'block' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-card c-card-no-padding">
                <table className="c-table-portal-home">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                        history.map((item={}) => {
                          return (
                            <tr key={`history-${item.ID}`} >
                              <td>{item.ID}</td>
                              <td>{item.Amount}</td>
                              <td className={`c-status ${RESERVE_HISTORY_STATUS_COLOR[item.Status]}`}>{item.Status}</td>
                              <td>{dayjs(item.CreatedAt).format('MM-DD-YYYY')}</td>
                            </tr>
                          )
                        })
                      }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      </div>
    );
  }
}

export default BuyToken;

// <div className="row">
// {history.length > 0 ?
//   <TablePagination
//     rowsPerPageOptions={[2, 5, 10, 25]}
//     colSpan={3}
//     count={50}
//     rowsPerPage={perPage}
//     page={page}
//     SelectProps={{
//       native: true,
//     }}
//     onChangePage={(e,p)=>this.onChangePage(p)}
//     onChangeRowsPerPage={(e)=>this.onChangeRowsPerPage(e.target.value)}
//     // ActionsComponent={TablePaginationActionsWrapped}
//   />
// : ""}
// </div>
