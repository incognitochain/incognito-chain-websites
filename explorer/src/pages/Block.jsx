import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { getBlock } from '@/reducers/constant/action';
import * as moment from 'moment';
import { formatHashStr } from '../services/formatter';
import BrowserDetect from '../services/browserdetect';

class Block extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    actionGetBlock: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { match, block } = this.props;
    const { blockHash } = match.params;

    this.state = {
      blockHash,
      block,
      isLatest: false
    };

    this.fetch();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.block[prevState.blockHash]?.updatedAt !==
      prevState.block[prevState.blockHash]?.updatedAt
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

  isBeacon = chainId => {
    return isNaN(chainId);
  };

  render() {
    const { blockHash, block } = this.state;
    const chainId = block[blockHash]?.data?.ShardID + 1;
    if (!block[blockHash]?.data) {
      return null;
    }

    let validateData = block[blockHash].data.ValidationData;
    var validateDataObj;
    if (validateData != '') {
      validateData = JSON.parse(validateData);
    }

    return (
      <div className="c-explorer-page c-explorer-page-block-details">
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
                  {!this.isBeacon(chainId) ? (
                    <>
                      <li>
                        <NavLink
                          exact
                          activeClassName="nav-active"
                          to="/chains"
                        >
                          Shard lists
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          exact
                          activeClassName="nav-active"
                          to={`/chain/${chainId}`}
                        >{`Shard ${chainId}`}</NavLink>
                      </li>
                      <li>
                        <NavLink
                          exact
                          activeClassName="nav-active"
                          className="c-hash"
                          to={`/block/${blockHash}`}
                        >
                          Block: {blockHash}
                        </NavLink>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <NavLink
                          exact
                          activeClassName="nav-active"
                          to="/chain/0"
                        >
                          Beacon Chain
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="heading">
                {this.isBeacon(chainId)
                  ? 'Beacon block details'
                  : 'Block details'}
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-data">
                  <table>
                    <tbody className="c-table c-table-list">
                      <tr>
                        <td className="title">Block height</td>
                        <td className="c-hash">
                          {block[blockHash].data.Height == 1
                            ? '[Genesis block]'
                            : block[blockHash].data.Height}
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Version</td>
                        <td className="c-hash">
                          {block[blockHash].data.Version}
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Confirmations</td>
                        <td className="c-hash">
                          {block[blockHash].data.Confirmations}
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Timestamp</td>
                        <td>
                          {moment
                            .unix(block[blockHash].data.Time)
                            .format('MMMM Do YYYY, h:mm:ss a')}
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Merkle TxS root</td>
                        <td>{block[blockHash].data.TxRoot}</td>
                      </tr>
                      <tr>
                        <td className="title">Round</td>
                        <td>{block[blockHash].data.Round}</td>
                      </tr>
                      <tr>
                        <td className="title">Epoch</td>
                        <td>{block[blockHash].data.Epoch}</td>
                      </tr>
                      {block[blockHash].data.CrossShards ? (
                        <tr>
                          <td>Crossed shards</td>
                          <td>
                            {block[blockHash].data.CrossShards.length == 0
                              ? '[empty]'
                              : block[blockHash].data.CrossShards.join(', ')}
                          </td>
                        </tr>
                      ) : null}
                      <tr>
                        <td className="title">Previous block</td>
                        <td className="c-hash">
                          <Link
                            to={
                              `/block/${block[blockHash].data.PreviousBlockHash}` +
                              (this.isBeacon(chainId) ? '?beacon=true' : '')
                            }
                          >
                            {formatHashStr(
                              block[blockHash].data.PreviousBlockHash,
                              BrowserDetect.isMobile
                            )}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Next block</td>
                        <td className="c-hash">
                          <Link
                            to={
                              `/block/${block[blockHash].data.NextBlockHash}` +
                              (this.isBeacon(chainId) ? '?beacon=true' : '')
                            }
                          >
                            {formatHashStr(
                              block[blockHash].data.NextBlockHash,
                              BrowserDetect.isMobile
                            )}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Block producer</td>
                        <td className="c-hash">
                          {BrowserDetect.isMobile
                            ? block[blockHash].data.BlockProducer.substring(5)
                            : block[blockHash].data.BlockProducer}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'top' }} className="title">
                          Validation data
                        </td>
                        <td className="c-hash">
                          <textarea readOnly cols={50} rows={10}>
                            {BrowserDetect.isMobile
                              ? block[blockHash].data.ValidationData.substring(
                                  5
                                )
                              : block[blockHash].data.ValidationData}
                          </textarea>
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Block producer signature</td>
                        <td className="c-hash">
                          {BrowserDetect.isMobile
                            ? validateDataObj
                              ? validateDataObj.ProducerBLSSig.substring(5) +
                                '...'
                              : ''
                            : validateDataObj
                            ? validateDataObj.ProducerBLSSig
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className="title">Aggregated signature</td>
                        <td>{validateDataObj ? validateDataObj.AggSig : ''}</td>
                      </tr>
                      {!this.isBeacon(chainId) ? (
                        <>
                          <tr>
                            <td className="title">Beacon height</td>
                            <td>{block[blockHash].data.BeaconHeight}</td>
                          </tr>
                          <tr>
                            <td className="title">Beacon block hash</td>
                            <td>
                              {formatHashStr(
                                block[blockHash].data.BeaconBlockHash,
                                BrowserDetect.isMobile
                              )}
                            </td>
                          </tr>
                        </>
                      ) : null}
                      {this.isBeacon(chainId) || true ? (
                        <tr>
                          <td
                            style={{ verticalAlign: 'top' }}
                            className="title"
                          >
                            Instructions
                          </td>
                          <td>
                            <textarea readOnly cols={50} rows={10}>
                              {JSON.stringify(
                                block[blockHash].data.Instructions,
                                null,
                                2
                              )}
                            </textarea>
                          </td>
                        </tr>
                      ) : null}
                      {block[blockHash].data.Txs ? (
                        <tr>
                          <td className="title">TXs</td>
                          <td className="c-hash">
                            <Link
                              to={`/block/${blockHash}/txs`}
                            >{`${block[blockHash].data.Txs.length} - View all`}</Link>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
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
    block: state.constant.block
  }),
  {
    actionGetBlock: getBlock
  }
)(Block);
