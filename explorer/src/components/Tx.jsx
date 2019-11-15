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
      return 'Init/Transfer custom token';
    }
    if (type === 'tp') {
      return 'Init/Transfer privacy custom token';
    }
    return '';
  };

  render() {
    const { tx } = this.props;

    return (
      <table className="c-table">
        <tbody>
          <tr>
            <td>Block height</td>
            <td>
              {tx.BlockHeight === 1
                ? '1 [Genesis block]'
                : formatBlocksHeight(tx.BlockHeight)}
            </td>
          </tr>
          <tr>
            <td>Tx Version</td>
            <td>{tx.Version}</td>
          </tr>
          <tr>
            <td>Tx of Shard</td>
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
            <td>Time created</td>
            <td>{tx.LockTime}</td>
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
            <td style={{ verticalAlign: 'top' }}>Privacy transaction</td>
            <td>
              <strong>{tx.IsPrivacy ? 'yes' : 'no'}</strong>
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'top' }}>More Information</td>
            <td>
              <i>{tx.Info}</i>
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'top' }}>Proof (base58check encode)</td>
            <td>
              <textarea disabled rows={10} cols={100}>
                {tx.Proof}
              </textarea>
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'top' }}>Proof Detail</td>
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
            <td style={{ verticalAlign: 'top' }}>Transacted privacy token</td>
            <td>
              <textarea disabled rows={10} cols={100}>
                {tx.PrivacyCustomTokenData == null
                  ? ''
                  : tx.PrivacyCustomTokenData}
              </textarea>
            </td>
          </tr>

          <tr>
            <td style={{ verticalAlign: 'top' }}>Privacy token proof detail</td>
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

          <tr>
            <td style={{ verticalAlign: 'top' }}>Privacy token transaction</td>
            <td>
              <textarea>
                {tx.PrivacyCustomTokenIsPrivacy ? 'yes' : 'no'}
              </textarea>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Tx;
