import React from 'react';
import PropTypes from 'prop-types';

class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTxType = (type) => {
    if (type == 's') {
      return 'Paid Salary';
    }
    if (type == 'n') {
      return 'Transfer constant';
    }
    if (type == 't') {
      return 'Init/Transfer custom token';
    }
    if (type == 'tp') {
      return 'Init/Transfer privacy custom token';
    }
  };

  render() {
    const { tx } = this.props;

    return (
      <table className="c-table">
        <tbody>
        <tr>
          <td>Version</td>
          <td>{tx.Version}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>{this.renderTxType(tx.Type)}</td>
        </tr>
        <tr>
          <td>Fee</td>
          <td>{tx.Fee}</td>
        </tr>
        <tr>
          <td>Lock time</td>
          <td>{tx.LockTime}</td>
        </tr>
        <tr>
          <td>SigPubKey</td>
          <td className="c-hash" style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal'
          }}>{tx.SigPubKey}</td>
        </tr>
        <tr>
          <td>Sig</td>
          <td className="c-hash" style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal'
          }}>{tx.Sig}</td>
        </tr>
        <tr>
          <td style={{ verticalAlign: 'top' }}>Proof</td>
          <td>
            <textarea disabled={true} rows={10} cols={100}>{JSON.stringify(tx.Proof, null, 4)}</textarea>
          </td>
        </tr>
        <tr>
          <td>Metadata</td>
          <td>
            <textarea disabled={true} rows={10} cols={100}>{tx.Metadata == null ? '' : tx.MetadData}</textarea>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default Tx;
