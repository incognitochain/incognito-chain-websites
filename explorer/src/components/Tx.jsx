import React from 'react';
import PropTypes from 'prop-types';
import { formatBlocksHeight, formatCoinValue } from '../services/formatter';

class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired
    // abcd: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTxType = type => {
    if (type === 's') {
      return 'Reward Tx';
    }
    if (type === 'n') {
      return 'Transfer';
    }
    if (type === 't') {
      return 'Init/Transfer custom coin';
    }
    if (type === 'tp') {
      return 'Init/Transfer privacy custom coin';
    }
    return '';
  };

  render() {
    const { tx } = this.props;
    const privacyCustomTokenData = JSON.parse(
      tx.PrivacyCustomTokenData || '{}'
    );

    let amount = NaN;

    if (
      !tx.PrivacyCustomTokenIsPrivacy &&
      tx.PrivacyCustomTokenProofDetail.InputCoins &&
      tx.PrivacyCustomTokenProofDetail.InputCoins.length > 0 &&
      tx.PrivacyCustomTokenProofDetail.OutputCoins &&
      tx.PrivacyCustomTokenProofDetail.OutputCoins.length > 0
    ) {
      amount = 0;
      const inputCoinsPublicKey =
        tx.PrivacyCustomTokenProofDetail.InputCoins[0].CoinDetails.PublicKey;

      const outputCoins = tx.PrivacyCustomTokenProofDetail.OutputCoins;
      outputCoins.map(outputCoin => {
        const publicKey = outputCoin.CoinDetails.PublicKey;

        if (publicKey !== inputCoinsPublicKey) {
          amount += outputCoin.CoinDetails.Value;
        }
      });

      if (amount === 0) {
        // in case sender sends token to themeselves
        amount = outputCoins[0].CoinDetails.Value;
      }
    }

    return (
      <React.Fragment>
        <div className="block content">
          <div className="block-data">
            <table className="c-table">
              <tbody>
                <tr>
                  <td>Status</td>
                  <td>{tx.BlockHash ? 'Success' : 'Pending'}</td>
                </tr>
                <tr>
                  <td>Sender</td>
                  <td>
                    <div className="censored" style={{ width: '400px' }} />
                  </td>
                </tr>
                <tr>
                  <td>Receiver</td>
                  <td>
                    <div className="censored" style={{ width: '400px' }} />
                  </td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>
                    {isNaN(amount) ? (
                      <div className="censored" />
                    ) : (
                      `${amount} ${privacyCustomTokenData.PropertySymbol || ''}`
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Timestamp</td>
                  <td>{new Date(tx.LockTime).toUTCString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="block content">
          <div className="block-data">
            <table className="c-table">
              <tbody>
                {tx.BlockHash && (
                  <tr>
                    <td>Block</td>
                    <td>{tx.BlockHash}</td>
                  </tr>
                )}
                <tr>
                  <td>Block height</td>
                  <td>
                    {tx.BlockHeight === 1
                      ? '1 [Genesis block]'
                      : formatBlocksHeight(tx.BlockHeight)}
                  </td>
                </tr>
                <tr>
                  <td>Tx version</td>
                  <td>{tx.Version}</td>
                </tr>
                <tr>
                  <td>Originating shard</td>
                  <td>{tx.ShardID}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{this.renderTxType(tx.Type)}</td>
                </tr>
                <tr>
                  <td>Fee</td>
                  <td>{`${formatCoinValue(tx.Fee / 1e9)} PRV`}</td>
                </tr>
                <tr>
                  <td>SigPubKey</td>
                  <td
                    className="c-hash"
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {tx.SigPubKey}
                  </td>
                </tr>
                <tr>
                  <td>Sig</td>
                  <td
                    className="c-hash"
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {tx.Sig}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>More information</td>
                  <td>
                    <i>{tx.Info}</i>
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>
                    Proof (base58check encode)
                  </td>
                  <td>
                    <textarea disabled rows={10} cols={100}>
                      {tx.Proof}
                    </textarea>
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Proof detail</td>
                  <td>
                    <textarea disabled rows={10} cols={100}>
                      {JSON.stringify(tx.ProofDetail, null, '  ')}
                    </textarea>
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>Metadata</td>
                  <td>
                    <textarea disabled rows={10} cols={100}>
                      {tx.Metadata == null ? '' : tx.Metadata}
                    </textarea>
                  </td>
                </tr>
                {/* <tr>
            <td style={{ verticalAlign: 'top' }}>Custom token</td>
            <td>
              <textarea disabled={true} rows={10} cols={100}>
                {tx.CustomTokenData == null ? '' : tx.CustomTokenData}
              </textarea>
            </td>
          </tr> */}

                <tr>
                  <td style={{ verticalAlign: 'top' }}>
                    Transacted privacy coin
                  </td>
                  <td>
                    <textarea disabled rows={10} cols={100}>
                      {tx.PrivacyCustomTokenData == null
                        ? ''
                        : tx.PrivacyCustomTokenData}
                    </textarea>
                  </td>
                </tr>

                <tr>
                  <td style={{ verticalAlign: 'top' }}>
                    Privacy coin proof detail
                  </td>
                  <td>
                    <textarea disabled rows={10} cols={100}>
                      {tx.PrivacyCustomTokenProofDetail == null
                        ? ''
                        : JSON.stringify(
                            tx.PrivacyCustomTokenProofDetail,
                            '\t',
                            '\t'
                          )}
                    </textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Tx;
