import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getTokens, getPrivacyTokens} from '@/reducers/constant/action';
import Avatar from '@material-ui/core/Avatar';
import {formatTokenAmount} from "../services/formatter";

class Tokens extends React.Component {
  static propTypes = {
    tokens: PropTypes.object.isRequired,
    privacyTokens: PropTypes.object.isRequired,
    actionGetTokens: PropTypes.func.isRequired,
    actionGetPrivacyTokens: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {actionGetTokens, actionGetPrivacyTokens, tokens, privacyTokens} = props;

    this.state = {
      tokens,
      privacyTokens,
    };
    actionGetTokens();
    actionGetPrivacyTokens();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.tokens.updatedAt !== prevState.tokens.updatedAt && nextProps.privacyTokens.updatedAt !== prevState.privacyTokens.updatedAt) {
      let temp = {};
      temp.tokens = nextProps.tokens;
      temp.privacyTokens = nextProps.privacyTokens;
      return temp;
    }
    return null;
  }

  render() {
    let {tokens, privacyTokens} = this.state;

    if (privacyTokens) {
      for (let i = 0; i < privacyTokens.list.length; i++) {
        tokens.list.push(privacyTokens.list[i]);
      }
    }

    console.log(tokens);

    return (
      <div className="c-explorer-page c-explorer-page-tokens">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/tokens">Tokens</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Tokens
                </div>
                <div className="block-data">
                  <table className="c-table">
                    <thead>
                    <tr>
                      <th>Token</th>
                      <th>Token name</th>
                      <th>Token symbol</th>
                      <th>Is Privacy</th>
                      <th>Token amount</th>
                      <th>TXs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tokens.list.length ? tokens.list.map(token => (
                      <tr key={token.ID}>
                        <td className="c-hash"><Link to={`/token/${token.ID}`}><Avatar alt="avatar"
                                                                                       src={token.Image}/></Link>
                        </td>
                        <td className="c-hash">{token.Name}</td>
                        <td className="c-hash">{token.Symbol}</td>
                        <td className="c-hash center">{token.IsPrivacy + ''}</td>
                        <td className="c-hash right">{formatTokenAmount(token.Amount)}</td>
                        <td className="c-hash right">{formatTokenAmount(token.ListTxs?.length | 0)}</td>
                      </tr>
                    )) : <tr>
                      <td style={{textAlign: 'center'}} colSpan={4}>Empty</td>
                    </tr>}
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
    privacyTokens: state.constant.privacyTokens,
  }),
  ({
    actionGetTokens: getTokens,
    actionGetPrivacyTokens: getPrivacyTokens,
  }),
)(Tokens);
