import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getBlock } from '@/reducers/constant/action';

class Txs extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actionGetBlock: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { match, block } = this.props;
    const { blockHash } = match.params;

    this.state = {
      blockHash,
      block,
    };

    this.fetch();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.block[prevState.blockHash] ?.updatedAt
        !== prevState.block[prevState.blockHash] ?.updatedAt
    ) {
      if (!nextProps.block[prevState.blockHash].data.NextBlockHash) {
        return { block: nextProps.block, isLatest: true };
      }
      return { block: nextProps.block, isLatest: false };
    }
    if (nextProps.match.params.blockHash !== prevState.blockHash) {
      return { blockHash: nextProps.match.params.blockHash };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { blockHash } = this.state;
    if (prevState.blockHash !== blockHash) {
      this.fetch();
    }
  }

  fetch = () => {
    const { actionGetBlock } = this.props;
    const { blockHash } = this.state;
    actionGetBlock(blockHash);
  }


  render() {
    const { blockHash, block } = this.state;
    const chainId = block[blockHash] ?.data ?.ChainID + 1;

    if (!block[blockHash] ?.data) {
      return null;
    }

    return (
      <div className="c-explorer-page c-explorer-page-chains">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/chains">Chain list</Link></li>
                  <li><Link to={`/chain/${chainId}`}>{`Chain #${chainId}`}</Link></li>
                  <li>
                    <Link
                      className="c-text-ellipsis c-hash"
                      style={{ maxWidth: '100px', display: 'inline-block', verticalAlign: 'top' }}
                      to={`/block/${blockHash}`}
                    >
                      {blockHash}
                    </Link>
                  </li>
                  <li><Link to={`/block/${blockHash}/txs`}>TXs</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12">
                    <h3>TXs of block</h3>
                    <div className="c-hash">{blockHash}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Txs
                </div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Tx hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block[blockHash].data.Txs.map((tx, index) => (
                      <tr key={tx}>
                        <td>{index}</td>
                        <td><Link to={`/tx/${tx.Hash}`} className="c-hash">{tx.Hash}</Link></td>
                      </tr>
                    ))}
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
    block: state.constant.block,
  }),
  ({
    actionGetBlock: getBlock,
  }),
)(Txs);
