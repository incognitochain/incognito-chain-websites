import React from "react";
import {connect} from 'react-redux';
import {axios, catchError} from "services/api";
import {API} from "../../constants";
import {Dialog, toaster, TextInputField, Alert} from "evergreen-ui";
import QRCode from "qrcode.react";
import {CopyToClipboard} from "react-copy-to-clipboard";

import {actions as walletActions} from '../../actions/wallet'
import {CircularProgress} from "@material-ui/core";

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      withdrawAmount: "",
      withdrawAddress: ""
    };
  }

  componentDidMount() {
    const {loadBalances} = this.props;
    loadBalances()
  }

  copySuccess = () => {
    toaster.success("Copy success!", {duration: 1});
  };

  /*withdraw = () => {
    const {currentBalance, withdrawAddress, amount} = this.state;
    let realAmount = Number(amount);

    if (currentBalance.SymbolName === "CONST") {
      realAmount *= 100;
    }

    axios
      .post(API.WALLET_WITHDRAW, {
        IsPrivacy: currentBalance.IsPrivacy,
        Amount: realAmount,
        TokenID: currentBalance.TokenID,
        PaymentAddress: withdrawAddress
      })
      .then(res => {
        const {data} = res;
        const {Result} = data;
        if (Result) {
          toaster.success("Withdraw success!");
        } else {
          toaster.warning("Withdraw fault!");
        }
        this.setState({isLoading: false, dialogWithdraw: false});
      })
      .catch(e => {
        toaster.warning("Withdraw fault!");
        this.setState({isLoading: false, dialogWithdraw: false});
        catchError(e);
      });
  };*/

  getAmount = (amount, symbolName) => {
    let rs = 0;
    if (symbolName === "CONST") {
      rs = Number.parseFloat(amount / 100);
    } else {
      rs = Number.parseFloat(amount);
    }
    return rs ? rs.toFixed(2) : 0.00;
  }

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  };

  render() {
    const {
      withdrawAmount,
      withdrawAddress,
    } = this.state;

    const {
      balances,
      paymentAddress,
      isLoading,
      depositDialog,
      isWithdrawing,
      withdrawDialog,
      withdraw,
      withdrawingBalance,
      depositDialogOpen,
      depositDialogClose,
      withdrawDialogOpen,
      withdrawDialogClose,
    } = this.props

    return (
      <div className="page wallet-page">
        <Dialog
          isShown={depositDialog}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title=""
          confirmLabel="Close"
          hasCancel={false}
          hasHeader={false}
          onCloseComplete={() => depositDialogClose()}
        >
          <div className="deposit-dialog">
            <Alert
              intent="warning"
              title="By depositing tokens to this address, you agree to our deposit recovery policy. Depositing tokens to an address other than CONSTANT may result in your funds being lost."
              marginBottom={5}
            />
            <div className="qrcode">
              <QRCode value={paymentAddress} size={200} renderAs="svg"/>
            </div>
            <div>
              <span className="c-code" style={{wordWrap: "break-word"}}>
                {paymentAddress}
              </span>
            </div>
            <div style={{textAlign: "center"}}>
              <CopyToClipboard text={paymentAddress} onCopy={this.copySuccess}>
                <a href="/wallet" onClick={e => e.preventDefault()}>
                  Copy
                </a>
              </CopyToClipboard>
            </div>
          </div>
        </Dialog>
        <Dialog
          isShown={withdrawDialog}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Withdraw"
          confirmLabel="Withdraw"
          isConfirmLoading={isWithdrawing}
          onCloseComplete={() =>
            withdrawDialogClose()
          }
          onConfirm={() => {
            withdraw(withdrawingBalance, withdrawAddress, withdrawAmount)
          }}
        >
          <div className="withdraw-dialog">
            <Alert
              intent="warning"
              title="Please verify your withdrawal address. We cannot refund an incorrect withdrawal. Do not withdraw directly to a crowdfund or ICO. We will not credit your account with tokens from that sale."
              marginBottom={5}
            />
            <div style={{margin: "30px 0 10px"}}>
              <TextInputField
                label="Amount"
                placeholder="0.00"
                autoComplete="off"
                width="100%"
                type="text"
                value={withdrawAmount}
                onChange={e => {
                  this.onlyNumber(e.target.value, () => {
                    this.setState({withdrawAmount: e.target.value});
                  });
                }}
              />
              <TextInputField
                label="Address"
                autoComplete="off"
                width="100%"
                type="text"
                value={withdrawAddress}
                onChange={e =>
                  this.setState({withdrawAddress: e.target.value})
                }
              />
            </div>
          </div>
        </Dialog>
        <div className="wallet-balances-list">
          <div className="container">
            <div className="c-card">
              <div className="row">
                <div className="hello">
                  Your Wallet
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="c-card c-card-no-padding" style={{overflow: "auto"}}>
                    <table className="c-table-user-wallet">
                      <thead>
                      <tr>
                        <th>Assets</th>
                        <th>Symbol</th>
                        <th>Total</th>
                        <th>Available</th>
                        <th>In Order</th>
                        <th width="280">#</th>
                      </tr>
                      </thead>
                      <tbody>
                      {isLoading && (
                        <tr>
                          <td colSpan="7" style={{textAlign: "center"}}><CircularProgress/></td>
                        </tr>
                      )}
                      {balances.map(balance => (
                        <tr key={balance.TokenID}>
                          <td className="name">{balance.SymbolName}</td>
                          <td
                            style={{
                              textTransform: "uppercase",
                              fontSize: "80%"
                            }}
                          >
                            {balance.SymbolCode}
                          </td>
                          <td>{this.getAmount(balance.TotalBalance, balance.SymbolName)}</td>
                          <td>{this.getAmount(balance.AvailableBalance, balance.SymbolName)}</td>
                          <td>{balance.InOrder}</td>
                          <td>
                            <button
                              className="btn btn-outline-success"
                              style={{marginRight: "5px"}}
                              type="button"
                              onClick={() => {
                                depositDialogOpen()
                              }}
                            >
                              Deposit
                            </button>
                            {balance.Withdrawable ? (
                              <button
                                className="btn btn-outline-primary"
                                style={{marginRight: "5px"}}
                                type="button"
                                onClick={() => {
                                  withdrawDialogOpen(balance)
                                }}
                              >
                                Withdraw
                              </button>
                            ) : (
                              ""
                            )}
                            {/* next Phrase
                            {balance.SymbolCode.toUpperCase() != "CONST" ? <a
                              href={`${process.env.REACT_APP_EXCHANGE_URL}/exchange/CONST-${balance.SymbolCode.toUpperCase()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-warning"
                            >
                              Exchange
                            </a> : ""}*/}
                          </td>
                        </tr>
                      ))}
                      {!isLoading && balances.length === 0 && (
                        <td colSpan="7">Empty</td>
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return ({
      isLoading: state.wallet.isLoading,
      balances: state.wallet.balances,
      paymentAddress: state.wallet.paymentAddress,
      depositDialog: state.wallet.depositDialog,
      withdrawDialog: state.wallet.withdrawDialog,
      isWithdrawing: walletActions.isWithdrawing,
      withdrawingBalance: state.wallet.withdrawingBalance,
    })
  },
  {
    loadBalances: walletActions.loadBalances,
    depositDialogOpen: walletActions.depositDialogOpen,
    depositDialogClose: walletActions.depositDialogClose,
    withdraw: walletActions.withdraw,
    withdrawDialogOpen: walletActions.withdrawDialogOpen,
    withdrawDialogClose: walletActions.withdrawDialogClose,
  }
)(Wallet);
