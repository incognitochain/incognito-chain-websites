import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
import { isEmpty } from 'lodash';
import {
  Dialog, toaster, TextInputField, Alert,
} from 'evergreen-ui';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Wallet extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      balancers: [],
      address: '',
      inited: false,
      dialogDeposit: false,
      dialogWithdraw: false,
      isLoading: false,
      currentBalance: {},
      amount: '',
      withdrawAddress: '',
    };

    this.loadBalancers();
  }

  loadBalancers = () => {
    axios.get(API.WALLET_BALANCES).then((res) => {
      const { data } = res;
      const { Result } = data;
      if (Result) {
        const { ListBalances, PaymentAddress } = Result;
        if (!isEmpty(ListBalances)) {
          this.setState({
            balancers: Object.keys(ListBalances).map(key => ListBalances[key]),
            address: PaymentAddress,
            inited: true,
          });
        }
      }
    }).catch((e) => {
      catchError(e);
      console.log(e);
    });
  }

  copySuccess = () => {
    toaster.success('Copy success!', { duration: 1 });
  }

  withdraw =() => {
    const { currentBalance, withdrawAddress, amount } = this.state;
    let realAmount = Number(amount);

    if (currentBalance.SymbolName === 'CONST') {
      realAmount *= 100;
    }

    axios.post(API.WALLET_WITHDRAW, {
      IsPrivacy: currentBalance.IsPrivacy,
      Amount: realAmount,
      TokenID: currentBalance.TokenID,
      PaymentAddress: withdrawAddress,
    }).then((res) => {
      const { data } = res;
      const { Result } = data;
      if (Result) {
        toaster.success('Withdraw success!');
      } else {
        toaster.warning('Withdraw fault!');
      }
      this.setState({ isLoading: false, dialogWithdraw: false });
    }).catch((e) => {
      toaster.warning('Withdraw fault!');
      this.setState({ isLoading: false, dialogWithdraw: false });
      catchError(e);
    });
  }

  onlyNumber = (value, cb) => {
    if (!Number.isNaN(Number(value))) {
      cb();
    }
  }

  render() {
    const {
      balancers, address, dialogDeposit, dialogWithdraw, isLoading, inited, amount, withdrawAddress,
    } = this.state;
    return (
      <div className="page wallet-page">
        <Dialog
          isShown={dialogDeposit}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title=""
          confirmLabel="Done"
          hasCancel={false}
          hasHeader={false}
          onCloseComplete={() => this.setState({ dialogDeposit: false })}
        >
          <div className="deposit-dialog">
            <Alert
              intent="warning"
              title="By depositing tokens to this address, you agree to our deposit recovery policy. Depositing tokens to an address other than CONSTANT may result in your funds being lost."
              marginBottom={5}
            />
            <div className="qrcode">
              <QRCode value={address} size={200} renderAs="svg" />
            </div>
            <div>
              <span className="c-code" style={{ wordWrap: 'break-word' }}>{address}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <CopyToClipboard text={address} onCopy={this.copySuccess}>
                <a href="/wallet" onClick={e => e.preventDefault()}>Copy</a>
              </CopyToClipboard>
            </div>
          </div>
        </Dialog>
        <Dialog
          isShown={dialogWithdraw}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Withdraw"
          confirmLabel="Withdraw"
          isConfirmLoading={isLoading}
          onCloseComplete={() => this.setState({
            dialogWithdraw: false, isLoading: false, currentBalance: {}, amount: '', withdrawAddress: '',
          })}
          onConfirm={() => { this.setState({ isLoading: true }); this.withdraw(); }}
        >
          <div className="withdraw-dialog">
            <Alert
              intent="warning"
              title="Please verify your withdrawal address. We cannot refund an incorrect withdrawal. Do not withdraw directly to a crowdfund or ICO. We will not credit your account with tokens from that sale."
              marginBottom={5}
            />
            <div style={{ margin: '30px 0 10px' }}>
              <TextInputField
                label="Amount"
                placeholder="0.00"
                autoComplete="off"
                width="100%"
                type="text"
                value={amount}
                onChange={(e) => {
                  this.onlyNumber(e.target.value, () => {
                    this.setState({ amount: e.target.value });
                  });
                }}
              />
              <TextInputField label="Address" autoComplete="off" width="100%" type="text" value={withdrawAddress} onChange={e => this.setState({ withdrawAddress: e.target.value })} />
            </div>
          </div>
        </Dialog>
        <div className="wallet-balancers-list">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card c-card-no-padding">
                  <table className="c-table-user-wallet">
                    <thead>
                      <tr>
                        <th width="270">Name</th>
                        <th width="180">Symbol</th>
                        <th width="90">Total</th>
                        <th width="90">Available</th>
                        <th width="100">In Order</th>
                        <th width="120">CST Value</th>
                        <th>Your decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!inited && (
                        <tr>
                          <td colSpan="7">Loading..</td>
                        </tr>
                      )}
                      {balancers.map(balance => (
                        <tr key={balance.TokenID}>
                          <td className="name">{balance.SymbolName}</td>
                          <td style={{ textTransform: 'uppercase', fontSize: '80%' }}>{balance.SymbolCode}</td>
                          <td>{balance.TotalBalance}</td>
                          <td>{balance.AvailableBalance}</td>
                          <td>{balance.InOrder}</td>
                          <td>{balance.ConstantValue}</td>
                          <td>
                            <button className="c-a-btn" type="button" onClick={() => { this.setState({ dialogDeposit: true }); }}>Deposit</button>
                            {balance.Withdrawable ? <button className="c-a-btn" type="button" onClick={() => { this.setState({ dialogWithdraw: true, currentBalance: balance }); }}>Withdraw</button> : ''}
                            <a href={`//exchange.constant.money/exchange/${balance.SymbolCode?.toUpperCase()}_BOND`} target="_blank" rel="noopener noreferrer" className="c-a-btn">
                              Exchange
                            </a>
                          </td>
                        </tr>
                      ))}
                      {inited && balancers.length === 0 && (
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
    );
  }
}

export default Wallet;
