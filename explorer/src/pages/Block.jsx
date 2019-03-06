import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getBlock } from '@/reducers/constant/action';
import * as moment from 'moment';

class Block extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actionGetBlock: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
  };

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
      nextProps.block[prevState.blockHash]?.updatedAt
      !== prevState.block[prevState.blockHash]?.updatedAt
    ) {
      if (!nextProps.block[prevState.blockHash]?.data?.NextBlockHash) {
        return {
          block: nextProps.block,
          isLatest: true
        };
      }
      return {
        block: nextProps.block,
        isLatest: false
      };
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
    const params = new URLSearchParams(this.props.location.search);
    let beacon = params.get('beacon');
    const { blockHash } = this.state;
    if (!beacon) {
      const { actionGetBlock } = this.props;
      actionGetBlock(blockHash);
    } else {
      const { actionGetBlock } = this.props;
      actionGetBlock(blockHash, true);
    }
  };

  isBeacon = (chainId) => {
    return isNaN(chainId);
  };

  render() {
    const { blockHash, block } = this.state;
    const chainId = block[blockHash]?.data?.ShardID + 1;
    if (!block[blockHash]?.data) {
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
                  {!this.isBeacon(chainId) ?
                    <>
                      <li><Link to="/chains">Shards list</Link></li>
                      <li><Link to={`/chain/${chainId}`}>{`Shard #${chainId}`}</Link></li>
                      <li>< Link className='c-hash' to={`/block/${blockHash}`}>{blockHash}</Link></li>
                    </>
                    : <>
                      <li><Link to="/chain/0">Beacon Chain</Link></li>
                    </>
                  }
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12">
                    <h3>Block</h3>
                    {this.isBeacon(chainId) ? <div>of beacon</div>
                      : null}
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
                    <td>Block height</td>
                    <td
                      className="c-hash">{block[blockHash].data.Height == 1 ? '[Genesis block]' : block[blockHash].data.Height}</td>
                  </tr>
                  <tr>
                    <td>Version</td>
                    <td className="c-hash">{block[blockHash].data.Version}</td>
                  </tr>
                  <tr>
                    <td>Confirmations</td>
                    <td className="c-hash">{block[blockHash].data.Confirmations}</td>
                  </tr>
                  <tr>
                    <td>Time</td>
                    <td>{moment.unix(block[blockHash].data.Time).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  </tr>
                  <tr>
                    <td>Merkle TxS Root</td>
                    <td>{block[blockHash].data.TxRoot}</td>
                  </tr>
                  <tr>
                    <td>R</td>
                    <td>{block[blockHash].data.R}</td>
                  </tr>
                  <tr>
                    <td>Round</td>
                    <td>{block[blockHash].data.Round}</td>
                  </tr>
                  <tr>
                    <td>Epoch</td>
                    <td>{block[blockHash].data.Epoch}</td>
                  </tr>
                  {block[blockHash].data.CrossShards ? <tr>
                    <td>Crossed Shards</td>
                    <td>{block[blockHash].data.CrossShards.length == 0 ? '[empty]' : block[blockHash].data.CrossShards.join(', ')}</td>
                  </tr> : null}
                  <tr>
                    <td>Previous block</td>
                    <td className="c-hash"><Link
                      to={`/block/${block[blockHash].data.PreviousBlockHash}`}>{block[blockHash].data.PreviousBlockHash}</Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Next block</td>
                    <td className="c-hash"><Link
                      to={`/block/${block[blockHash].data.NextBlockHash}`}>{block[blockHash].data.NextBlockHash}</Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Block producer</td>
                    <td className="c-hash">{block[blockHash].data.BlockProducer}</td>
                  </tr>
                  <tr>
                    <td>Block producer Signature</td>
                    <td className="c-hash">{block[blockHash].data.BlockProducerSign}</td>
                  </tr>
                  <tr>
                    <td>Aggregated Signature</td>
                    <td>{block[blockHash].data.AggregatedSig}</td>
                  </tr>
                  {!this.isBeacon(chainId) ?
                    <>
                      <tr>
                        <td>Beacon Height</td>
                        <td>{block[blockHash].data.BeaconHeight}</td>
                      </tr>
                      <tr>
                        <td>Beacon Block Hash</td>
                        <td>{block[blockHash].data.BeaconBlockHash}</td>
                      </tr>
                    </> : null}
                  {this.isBeacon(chainId) ? <tr>
                    <td>Instruction</td>
                    <td><textarea cols={120}
                                  rows={10}>{JSON.stringify(block[blockHash].data.Instructions, null, 2)}</textarea>
                    </td>
                  </tr> : null}
                  {block[blockHash].data.Txs ?
                    <tr>
                      <td>TXs</td>
                      <td className="c-hash"><Link
                        to={`/block/${blockHash}/txs`}>{`${block[blockHash].data.Txs.length} - View all`}</Link></td>
                    </tr> : null
                  }
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
