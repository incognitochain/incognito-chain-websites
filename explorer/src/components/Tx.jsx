import React from 'react';
import PropTypes from 'prop-types';

class Tx extends React.Component {
  static propTypes = {
    tx: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {tx} = this.props;

    return (
      <table className="c-table">
        <tbody>
        <tr>
          <td>Version</td>
          <td>{tx.Version}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>{tx.Type}</td>
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
          <td className="c-hash" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{tx.SigPubKey}</td>
        </tr>
        <tr>
          <td>Sig</td>
          <td className="c-hash" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{tx.Sig}</td>
        </tr>
        <tr>
          <td>Proof</td>
          <td>
            <pre>{JSON.stringify(tx.Proof, null, 4)}</pre>
          </td>
        </tr>
        <tr>
          <td>Metadata</td>
          <td>
            <pre>{tx.Metadata}</pre>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default Tx;
