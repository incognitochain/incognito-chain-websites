import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getMempoolInfo } from '@/reducers/constant/action';
import { isEmpty } from 'lodash';

class TxsPending extends React.Component {
  static propTypes = {
    // match: PropTypes.object.isRequired,
    actionGetMempoolInfo: PropTypes.func.isRequired,
    mempool: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { mempool, actionGetMempoolInfo } = this.props;

    this.state = {
      mempool,
    };

    actionGetMempoolInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.mempool.updatedAt !== prevState.mempool.updatedAt) {
      return { mempool: nextProps.mempool };
    }
    return null;
  }

  render() {
    const { mempool } = this.state;

    if (isEmpty(mempool.info)) return null;

    return (
      <div className="c-explorer-page c-explorer-page-chains">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/txs/pending">Pending TXs</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Pendings TXs
                </div>
                <table className="c-table">
                  <thead>
                    <tr>
                      <th>Tx hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mempool.info.ListTxs.length ? mempool.info.ListTxs.map(tx => (
                      <tr><td className="c-hash">{tx}</td></tr>
                    )) : <tr><td style={{ textAlign: 'center' }}>Empty</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    mempool: state.constant.mempool,
  }),
  ({
    actionGetMempoolInfo: getMempoolInfo,
  }),
)(TxsPending);
