import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { getTx } from '@/reducers/constant/action';
import TxComponent from '@/components/Tx';

class Tx extends React.Component {
  constructor(props) {
    super(props);

    const { match, actionGetTx, tx } = this.props;
    const { txHash } = match.params;

    this.state = {
      txHash,
      tx
    };

    actionGetTx(txHash);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.tx[prevState.txHash]?.updatedAt !==
      prevState.tx[prevState.txHash]?.updatedAt
    ) {
      return { tx: nextProps.tx };
    }
    return null;
  }

  render() {
    const { txHash, tx } = this.state;

    let specTx = tx[txHash];

    if (!(specTx && !isEmpty(specTx.data))) {
      return null;
    }

    specTx = specTx.data;
    const chainId = (specTx?.ShardID || 0) + 1;

    return (
      <div className="c-explorer-page c-explorer-page-tx">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li>
                    <NavLink exact activeClassName="nav-active" to="/">
                      Explorer
                    </NavLink>
                  </li>
                  {specTx.BlockHash && (
                    <li>
                      <NavLink
                        exact
                        activeClassName="nav-active"
                        to={`/block/${specTx.BlockHash}`}
                        className="c-text-ellipsis c-hash"
                        style={{
                          maxWidth: '100px',
                          display: 'inline-block',
                          verticalAlign: 'top'
                        }}
                      >
                        {specTx.BlockHash}
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to={
                        specTx.BlockHash
                          ? `/block/${specTx.BlockHash}/txs`
                          : '/txs/pending'
                      }
                    >
                      {specTx.BlockHash ? 'TXs' : 'Pending TXs'}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      className="c-hash c-text-cut"
                      to={`/tx/${txHash}`}
                    >
                      {txHash}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="heading multiple-line">Transaction Details</div>
            </div>
            <div className="col-12">
              <TxComponent tx={specTx} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Tx.propTypes = {
  tx: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actionGetTx: PropTypes.func.isRequired
};

export default connect(
  state => ({
    tx: state.constant.tx
  }),
  {
    actionGetTx: getTx
  }
)(Tx);
