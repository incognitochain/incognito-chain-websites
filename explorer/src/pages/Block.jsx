import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getBlock } from '@/reducers/constant/action';

class Block extends React.Component {
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
      isLatest: false,
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
    const { blockHash, isLatest } = this.state;
    if (prevState.blockHash !== blockHash) {
      this.fetch();
    }
    if (prevState.blockHash === blockHash && isLatest) {
      // setTimeout(() => this.fetch(), 1000);
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
                  <li><Link className="c-hash" to={`/block/${blockHash}`}>{blockHash}</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12">
                    <h3>Block</h3>
                    <div className="c-hash c-text-cut">{blockHash}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <table>
                  <tbody className="c-table c-table-list">
                    <tr>
                      <td>Block number at chain</td>
                      <td className="c-hash">{block[blockHash].data.Height}</td>
                    </tr>
                    <tr>
                      <td>Version</td>
                      <td className="c-hash">{block[blockHash].data.Version}</td>
                    </tr>
                    <tr>
                      <td>Confirmations</td>
                      <td className="c-hash">{block[blockHash].data.confirmations}</td>
                    </tr>
                    <tr>
                      <td>Time</td>
                      <td>{block[blockHash].data.Time}</td>
                    </tr>
                    <tr>
                      <td>Previous block</td>
                      <td className="c-hash"><Link to={`/block/${block[blockHash].data.PreviousBlockHash}`}>{block[blockHash].data.PreviousBlockHash}</Link></td>
                    </tr>
                    <tr>
                      <td>Next block</td>
                      <td className="c-hash"><Link to={`/block/${block[blockHash].data.NextBlockHash}`}>{block[blockHash].data.NextBlockHash}</Link></td>
                    </tr>
                    <tr>
                      <td>Block producer</td>
                      <td className="c-hash">{block[blockHash].data.BlockProducer}</td>
                    </tr>
                    <tr>
                      <td>Block producer sign</td>
                      <td className="c-hash">{block[blockHash].data.BlockProducerSign}</td>
                    </tr>
                    <tr>
                      <td>Block data</td>
                      <td>{block[blockHash].data.Data}</td>
                    </tr>
                    <tr>
                      <td>TXs</td>
                      <td className="c-hash"><Link to={`/block/${blockHash}/txs`}>{`${block[blockHash].data.Txs.length} - View all`}</Link></td>
                    </tr>
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
)(Block);
