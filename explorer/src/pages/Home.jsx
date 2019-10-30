import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { checkHash } from '@/reducers/constant/action';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { trim } from 'lodash';
import { formatBlocksHeight, formatHashStr } from '../services/formatter';
import BrowserDetect from '../services/browserdetect';
import moment from 'moment';
import RecentBlockIcon from '@/assets/icon/recent-block.svg';
import BeaconIcon from '@/assets/icon/beacon.svg';

class Home extends React.Component {
  static propTypes = {
    actionCheckHash: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { chainInfo } = this.props;
    const { search } = props;

    this.state = {
      chainInfo,
      searchError: '',
      searchSuccess: '',
      searchUpdateAt: search.updatedAt,
      keyword: ''
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    if (nextProps.search.updatedAt !== prevState.searchUpdateAt) {
      const { search } = nextProps;
      if (search.keyword) {
        if (search.success) {
          return {
            searchSuccess: search.success,
            searchUpdateAt: nextProps.search.updatedAt
          };
        }
        return {
          searchError: "This's not Tx hash or Block hash",
          searchUpdateAt: nextProps.search.updatedAt
        };
      }
    }
    return null;
  }

  componentDidUpdate() {
    const { keyword, searchSuccess } = this.state;
    const { dispatch } = this.props;

    if (searchSuccess) {
      switch (searchSuccess) {
        case 'tx':
          dispatch({ type: 'CLEAR_SEARCH' });
          dispatch(push(`/tx/${keyword}`));
          return;
        case 'pending':
          dispatch({ type: 'CLEAR_SEARCH' });
          dispatch(push(`/tx/pending/${keyword}`));
          return;
        case 'block':
          dispatch({ type: 'CLEAR_SEARCH' });
          dispatch(push(`/block/${keyword}`));
          return;
        case 'beaconblock':
          dispatch({ type: 'CLEAR_SEARCH' });
          dispatch(push(`/block/${keyword}?beacon=true`));
          return;
        default:
          console.log('Not match type');
      }
    }
  }

  submitSearch = e => {
    const { actionCheckHash } = this.props;

    e.preventDefault();
    const keyword = trim(this.searchInput.value);
    this.setState({ keyword });
    actionCheckHash(keyword);
  };

  render() {
    const { chainInfo, searchError } = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;

    return (
      <div className="c-explorer-page c-explorer-page-home">
        <div className="content home-search">
          <div className="container">
            <form onSubmit={this.submitSearch}>
              <input
                type="text"
                className="c-input"
                placeholder="Search block hash, tx hash or wallet address ..."
                ref={div => {
                  this.searchInput = div;
                  return null;
                }}
              />
              {searchError && (
                <span className="c-text-error">{searchError}</span>
              )}
            </form>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div
              className="col-12"
              style={{
                paddingBottom: '20px',
                fontSize: '13px'
              }}
            ></div>
          </div>
          <div className="row">
            <div className="col-12"></div>
            {/*<div className="col-12">
              <div className="block content">
                <Link to="/info">Blockchain Advance Information </Link>
              </div>
            </div>*/}
            <div className="col-12">
              <div className="block content" id="best-blocks">
                <div className="block-heading">Beacon chain</div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                      <tr>
                        <th>Block Hash</th>
                        <th className="right">Height</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={-1}>
                        <td>
                          <div className="hash-container">
                            <img src={BeaconIcon} className="icon" />
                            <div>
                              <Link
                                to={`/block/${bestBlocks[-1].Hash}?beacon=true`}
                                className="c-hash"
                              >
                                {formatHashStr(
                                  bestBlocks[-1].Hash,
                                  BrowserDetect.isMobile
                                )}
                              </Link>
                              <br />
                              <i className="block-time">
                                {moment(bestBlocks[-1].Time * 1000).fromNow()}
                              </i>
                            </div>
                          </div>
                        </td>
                        <td className="right">
                          {formatBlocksHeight(bestBlocks[-1].Height)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content" id="best-blocks">
                <div className="block-heading">Most Recent Blocks</div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                      <tr>
                        <th>Block Hash</th>
                        <th className="center">No. of Shards</th>
                        <th className="center">Height</th>
                        <th className="right">No. of TXs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(bestBlocks).map(key => {
                        if (key == -1) {
                          return <></>;
                        }
                        return (
                          <tr key={key}>
                            <td>
                              <div className="hash-container">
                                <img src={RecentBlockIcon} className="icon" />
                                <div>
                                  <Link
                                    to={`/block/${bestBlocks[key].Hash}`}
                                    className="c-hash"
                                  >
                                    {formatHashStr(
                                      bestBlocks[key].Hash,
                                      BrowserDetect.isMobile
                                    )}
                                  </Link>
                                  <br />
                                  <i className="block-time">
                                    {moment(
                                      bestBlocks[key].Time * 1000
                                    ).fromNow()}
                                  </i>
                                </div>
                              </div>
                            </td>
                            <td className="center">
                              <Link
                                to={`/chain/${parseInt(key, 10) + 1}`}
                                className="c-hash"
                              >
                                {parseInt(key, 10)}
                              </Link>
                            </td>
                            <td className="center">
                              <Link
                                to={`/block/${bestBlocks[key].Hash}`}
                                className="c-hash"
                              >
                                {formatBlocksHeight(bestBlocks[key].Height)}
                              </Link>
                            </td>
                            <td className="right">
                              {formatBlocksHeight(bestBlocks[key].TotalTxs)}
                            </td>
                          </tr>
                        );
                      })}
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
    chainInfo: state.constant.chainInfo,
    search: state.constant.search
  }),
  dispatch => ({
    actionCheckHash: hash => dispatch(checkHash(hash)),
    dispatch
  })
)(Home);
