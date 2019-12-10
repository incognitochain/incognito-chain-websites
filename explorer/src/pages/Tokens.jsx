import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { getTokens, getPrivacyTokens } from '@/reducers/constant/action';
import { formatTokenAmount } from '../services/formatter';

class Tokens extends React.Component {
  static propTypes = {
    tokens: PropTypes.object.isRequired,
    privacyTokens: PropTypes.object.isRequired,
    actionGetTokens: PropTypes.func.isRequired,
    actionGetPrivacyTokens: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {
      actionGetTokens,
      actionGetPrivacyTokens,
      tokens,
      privacyTokens
    } = props;

    this.state = {
      tokens,
      privacyTokens
    };
    actionGetTokens();
    actionGetPrivacyTokens();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.tokens.updatedAt !== prevState.tokens.updatedAt &&
      nextProps.privacyTokens.updatedAt !== prevState.privacyTokens.updatedAt
    ) {
      const temp = {};
      temp.tokens = nextProps.tokens;
      temp.privacyTokens = nextProps.privacyTokens;
      return temp;
    }
    return null;
  }

  render() {
    const { tokens, privacyTokens } = this.state;
    const listTokens = {
      list: []
    };
    if (tokens) {
      for (let i = 0; i < tokens.list.length; i++) {
        listTokens.list.push(tokens.list[i]);
      }
    }
    if (privacyTokens) {
      for (let i = 0; i < privacyTokens.list.length; i++) {
        listTokens.list.push(privacyTokens.list[i]);
      }
    }

    return (
      <div className="c-explorer-page c-explorer-page-tokens">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li>
                    <Link to="/">Explorer</Link>
                  </li>
                  <li>
                    <Link to="/tokens">Privacy Coins</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Privacy Coins</div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                      <tr>
                        {/* <th>Coin</th> */}
                        <th>Name</th>
                        <th>Ticker</th>
                        <th>Privacy Status</th>
                        <th>Supply</th>
                        <th>No. of TXs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTokens.list.length ? (
                        listTokens.list.map(token => (
                          <tr key={token.ID}>
                            {/* <td className="c-hash">
                              <Link
                                to={`/token/${token.ID}?privacy=${token.IsPrivacy}`}
                              >
                                <Avatar alt="avatar" src={token.Image} />
                              </Link>
                            </td> */}
                            <td className="c-hash">{token.Name}</td>
                            <td className="c-hash">{token.Symbol}</td>
                            <td className="c-hash">{`${token.IsPrivacy}`}</td>
                            <td className="c-hash">
                              {formatTokenAmount(token.Amount)}
                            </td>
                            <td className="c-hash">
                              {formatTokenAmount(token.CountTxs | 0)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td style={{ textAlign: 'center' }} colSpan={4}>
                            Empty
                          </td>
                        </tr>
                      )}
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
    tokens: state.constant.tokens,
    privacyTokens: state.constant.privacyTokens
  }),
  {
    actionGetTokens: getTokens,
    actionGetPrivacyTokens: getPrivacyTokens
  }
)(Tokens);
