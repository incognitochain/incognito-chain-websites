import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getToken } from '@/reducers/constant/action';

class Token extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    token: PropTypes.object.isRequired,
    actionGetToken: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { actionGetToken, token, match } = props;
    const { customTokenId } = match.params;

    this.state = {
      customTokenId,
      token,
    };

    actionGetToken(customTokenId);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.token[prevState.customTokenId] ?.updatedAt
        !== prevState.token[prevState.customTokenId] ?.updatedAt
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

    console.log(token);
    console.log(token[customTokenId]);

    if (!token[customTokenId]) return null;

    return (
      <div className="c-explorer-page c-explorer-page-tokens">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/tokens">Tokens</Link></li>
                  <li><Link to={`/token/${customTokenId}`} className="c-hash">{customTokenId}</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="row">
                  <div className="col-12">
                    <h3>Token</h3>
                    <span className="c-hash">{customTokenId}</span>
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
                    {token[customTokenId].data.ListTxs.map((tx, index) => (
                      <tr key={tx}>
                        <td>{index}</td>
                        <td><Link to={`/tx/${tx}`} className="c-hash">{tx}</Link></td>
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
    token: state.constant.token,
  }),
  ({
    actionGetToken: getToken,
  }),
)(Token);
