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
            <td>JSPubKey</td>
            <td className="c-hash" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{tx.JSPubKey}</td>
          </tr>
          <tr>
            <td>JSSig</td>
            <td className="c-hash" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{tx.JSSig}</td>
          </tr>
          <tr>
            <td>AddressLastByte</td>
            <td>{tx.AddressLastByte}</td>
          </tr>
          <tr>
            <td>Descs</td>
            <td><pre>{JSON.stringify(tx.Descs, null, 4)}</pre></td>
          </tr>
          <tr>
            <td>Metadata</td>
            <td><pre>{tx.MetaData}</pre></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Tx;
