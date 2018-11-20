import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from '@sindresorhus/class-names';
import { getBlocks, getBlockchainInfo } from '@/reducers/constant/action';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

class Chain extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    chainInfo: PropTypes.object.isRequired,
    blocks: PropTypes.object.isRequired,
    actionGetBlocks: PropTypes.func.isRequired,
    actionGetBlockChainInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { match, chainInfo, blocks } = this.props;
    const { chainId } = match.params;
    const rawchainId = chainId - 1;

    this.state = {
      blocks,
      chainId,
      chainInfo,
      rawchainId,
      page: 1,
    };

    const { actionGetBlocks, actionGetBlockChainInfo } = this.props;
    actionGetBlocks(rawchainId);
    actionGetBlockChainInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.blocks[prevState.rawchainId] ?.updatedAt
        !== prevState.blocks[prevState.rawchainId] ?.updatedAt
    ) {
      return { blocks: nextProps.blocks };
    }
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    const pageRegexExeced = /\?page=(\d+)$/.exec(nextProps.history.location.search);
    if (pageRegexExeced) {
      return { page: parseInt(pageRegexExeced[1], 10) };
    }
    return null;
  }

  render() {
    const {
      chainId, rawchainId, chainInfo, blocks, page,
    } = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;
    const chainBlock = bestBlocks[rawchainId];

    const totalPage = Math.ceil(chainBlock.Height / 20);

    let prevPage = page - 1;
    if (prevPage <= 0) prevPage = 1;
    let nextPage = page + 1;
    console.log(nextPage);
    if (nextPage > totalPage) nextPage = totalPage;

    return (
      <div className="c-explorer-page c-explorer-page-chain">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/chains">Chain list</Link></li>
                  <li><Link to={`/chain/${chainId}`}>{`Chain #${chainId}`}</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h3>{`Chain #${chainId}`}</h3>
                  </div>
                  <div className="col-12 col-md-6">
                    <table className="c-table c-table-list">
                      <tbody>
                        <tr>
                          <td>Total block</td>
                          <td><Link to={`/block/${chainBlock.Hash}`} className="c-hash">{chainBlock.Height}</Link></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <table className="c-table c-table-list">
                  <tbody>
                    <tr>
                      <td>Block producer</td>
                      <td className="c-hash">{chainBlock.BlockProducer}</td>
                    </tr>
                    <tr>
                      <td>Salary fund</td>
                      <td>{chainBlock.SalaryFund}</td>
                    </tr>
                    <tr>
                      <td>Salary per TX</td>
                      <td>{chainBlock.SalaryPerTx}</td>
                    </tr>
                    <tr>
                      <td>Total TXs</td>
                      <td>{chainBlock.TotalTxs}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Blocks
                </div>
                <div>
                  <table className="c-table c-table-list">
                    <thead>
                      <tr>
                        <th>Height</th>
                        <th>Hash</th>
                        <th>TXs count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blocks[rawchainId] && blocks[rawchainId].list.map(blockchain => (
                        <tr key={blockchain.Hash}>
                          <td>{blockchain.Height}</td>
                          <td className="c-hash"><Link to={`/block/${blockchain.Hash}`}>{blockchain.Hash}</Link></td>
                          <td className="c-hash"><Link to={`/block/${blockchain.Hash}/txs`}>{blockchain.TxHashes.length}</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <div className="c-pagination" style={{ display: 'none' }}>
                      <ul>
                        <li className={cn({
                          prev: (page !== 1),
                        })}
                        >
                          <Link
                            to={`?page=${prevPage}`}
                            onClick={(e) => {
                              if (page === 1) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </Link>
                        </li>
                        {page - 3 > 0 ? <li><Link to="?page=1">1</Link></li> : ''}
                        {page - 3 > 0 ? <li><Link to="?page=2">2</Link></li> : ''}
                        {page - 3 > 0 ? <li><Link to={`?page=${page}`} onClick={(e) => { e.preventDefault(); }}>...</Link></li> : ''}
                        {page - 2 > 0 ? <li><Link to={`?page=${page - 2}`}>{page - 2}</Link></li> : ''}
                        {page - 1 ? <li><Link to={`?page=${page - 1}`}>{page - 1}</Link></li> : ''}
                        <li className="active">
                          <Link
                            to={`?page=${page}`}
                            onClick={(e) => { e.preventDefault(); }}
                          >
                            {page}
                          </Link>
                        </li>
                        {page + 1 <= totalPage ? <li><Link to={`?page=${page + 1}`}>{page + 1}</Link></li> : ''}
                        {page + 2 <= totalPage ? <li><Link to={`?page=${page + 2}`}>{page + 2}</Link></li> : ''}
                        {page + 3 < totalPage ? <li><Link to={`?page=${page}`} onClick={(e) => { e.preventDefault(); }}>...</Link></li> : ''}
                        {page + 3 < totalPage ? <li><Link to={`?page=${totalPage - 1}`}>{totalPage - 1}</Link></li> : ''}
                        {page + 3 < totalPage ? <li><Link to={`?page=${totalPage}`}>{totalPage}</Link></li> : ''}
                        <li className={cn({
                          next: (page !== totalPage),
                        })}
                        >
                          <Link
                            to={`?page=${nextPage}`}
                            onClick={(e) => {
                              if (page === totalPage) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
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
    blocks: state.constant.chainBlocks,
    chainInfo: state.constant.chainInfo,
  }),
  ({
    actionGetBlocks: getBlocks,
    actionGetBlockChainInfo: getBlockchainInfo,
  }),
)(Chain);
