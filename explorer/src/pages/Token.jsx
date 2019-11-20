import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import queryString from 'query-string';
import {
  getPrivacyTokenTxs,
  getTokenTxs,
  getTokenHolder
} from '@/reducers/constant/action';
import { formatTokenAmount } from '@/services/formatter';

class Token extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
    actionGetToken: PropTypes.func.isRequired,
    actionGetPrivacyToken: PropTypes.func.isRequired,
    actionGetTokenHolder: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const {
      actionGetToken,
      actionGetPrivacyToken,
      actionGetTokenHolder,
      token,
      match
    } = props;
    const { customTokenId } = match.params;

    this.state = {
      customTokenId,
      token
    };
    const values = queryString.parse(props.location.search);
    if (values.privacy === 'true') {
      actionGetPrivacyToken(customTokenId);
    } else {
      actionGetToken(customTokenId);
      actionGetTokenHolder(customTokenId);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.token[prevState.customTokenId]?.updatedAt !==
      prevState.token[prevState.customTokenId]?.updatedAt
    ) {
      return { token: nextProps.token };
    }
    if (nextProps.match.params.customTokenId !== prevState.customTokenId) {
      return { customTokenId: nextProps.match.params.customTokenId };
    }
    return null;
  }

  render() {
    const { token, customTokenId } = this.state;
    const { tokenHolders } = this.props;
    if (!token[customTokenId]) return null;

    return (
      <div className="c-explorer-page c-explorer-page-tokens">
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
                    <NavLink exact activeClassName="nav-active" to="/tokens">
                      Tokens
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to={`/token/${customTokenId}`}
                      className="c-hash"
                    >
                      {customTokenId}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12">
                    <h3>Token</h3>
                    <span className="c-hash">ID: {customTokenId}</span><br/>
                    <span className="c-hash">Name: {token[customTokenId].data.Name}</span><br/>
                    <span className="c-hash">Symbol: {token[customTokenId].data.Symbol}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Txs</div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Tx hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {token[customTokenId].data.ListTxs.map((tx, index) => (
                      <tr key={tx}>
                        <td>
#
                          {index + 1}
                        </td>
                        <td>
                          <Link to={`/tx/${tx}`} className="c-hash">
                            {tx}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/*<div className="col-12">
              <div className="block content">
                <div className="block-heading">Token Holders</div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>Holder</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenHolders[customTokenId] ? (
                      Object.entries(tokenHolders[customTokenId].data).map(
                        ([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>
#
                                {key + 1}
                              </td>
                              <td>{formatTokenAmount(value)}</td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td colSpan={2} style={{ textAlign: 'center' }}>
                          Can not get holder
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    token: state.constant.token,
    tokenHolders: state.constant.tokenHolders
  }),
  {
    actionGetToken: getTokenTxs,
    actionGetPrivacyToken: getPrivacyTokenTxs,
    actionGetTokenHolder: getTokenHolder
  }
)(Token);
