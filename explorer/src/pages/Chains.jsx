import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import moment from 'moment';
import { getBlockchainInfo } from '@/reducers/constant/action';
import {
  formatBlocksHeight,
  formatCoinValue,
  formatHashStr
} from '../services/formatter';
import BrowserDetect from '../services/browserdetect';
import ShardIcon from '@/assets/icon/chain-shard.svg';

class Chains extends React.Component {
  static propTypes = {
    actionGetBlockChainInfo: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { chainInfo } = this.props;

    this.state = {
      chainInfo
    };

    this.loadData();
    setInterval(this.loadData, 15 * 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    return null;
  }

  componentDidMount() {
    this.loadData();
    this.loadDataInterval = setInterval(this.loadData, 15 * 1000);
  }

  componentWillUnmount() {
    if (this.loadDataInterval) clearInterval(this.loadDataInterval);
  }

  loadData = () => {
    const { actionGetBlockChainInfo } = this.props;
    actionGetBlockChainInfo();
  };

  render() {
    const { chainInfo } = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;
    const blockBeacon = bestBlocks[-1];

    return (
      <div className="c-explorer-page c-explorer-page-chains">
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
                  <li>
                    <NavLink exact activeClassName="nav-active" to="/chains">
                      Shard list
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <h3 className="heading">Shard list</h3>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {Object.keys(bestBlocks).map(key => {
              if (key == -1) {
                return <></>;
              }
              const index = parseInt(key);
              const block = bestBlocks[key];
              return (
                <div
                  className="col-12 col-sm-6 col-md-6 chain-item"
                  key={block.Hash}
                >
                  <Link to={`/chain/${index + 1}`} className="card">
                    <div className="chain-item-container">
                      <img src={ShardIcon} className="icon" />
                      <div>
                        <strong className="chain-id">{`Shard ${index}`}</strong>
                        <table className="chain-item-content">
                          <tr>
                            <td>Height:</td>
                            <td>{formatBlocksHeight(block.Height)}</td>
                          </tr>
                          <tr>
                            <td>Most recent block:</td>
                            <td>{formatHashStr(block.Hash, true)}</td>
                          </tr>
                          <tr>
                            <td>Total txs:</td>
                            <td>{formatBlocksHeight(block.TotalTxs)}</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <i className="block-time">
                                {moment(block.Time * 1000).fromNow()}
                              </i>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    chainInfo: state.constant.chainInfo
  }),
  {
    actionGetBlockChainInfo: getBlockchainInfo
  }
)(Chains);
