import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDCB, getCB, getGOV } from '@/reducers/constant/action';


class Info extends React.Component {
  static propTypes = {
    dcb: PropTypes.object.isRequired,
    cb: PropTypes.object.isRequired,
    gov: PropTypes.object.isRequired,
    actionGetDCB: PropTypes.func.isRequired,
    actionGetCB: PropTypes.func.isRequired,
    actionGetGOV: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const {
      actionGetDCB, actionGetCB, actionGetGOV,
      dcb, cb, gov,
    } = props;

    this.state = {
      dcb, cb, gov,
    };

    actionGetDCB();
    actionGetCB();
    actionGetGOV();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dcb.updatedAt !== prevState.dcb.updatedAt) {
      return { dcb: nextProps.dcb };
    }
    if (nextProps.cb.updatedAt !== prevState.cb.updatedAt) {
      return { cb: nextProps.cb };
    }
    if (nextProps.gov.updatedAt !== prevState.gov.updatedAt) {
      return { gov: nextProps.gov };
    }
    return null;
  }

  render() {
    const { dcb, cb, gov } = this.state;

    return (
      <div className="c-explorer-page c-explorer-page-tx">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/info">Blockchain advance information</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">DCB</div>
                <div className="row">
                  <div className="col-12">
                    <table className="c-table">
                      <tbody>
                        {
                          dcb.list.length
                            ? dcb.list.map(b => <tr><td>{b}</td></tr>)
                            : <tr><td>Empty</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">CB</div>
                <div className="row">
                  <div className="col-12">
                    <table className="c-table">
                      <tbody>
                        {
                          cb.list.length
                            ? cb.list.map(b => <tr><td>{b}</td></tr>)
                            : <tr><td>Empty</td></tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">GOV</div>
                <div className="row">
                  <div className="col-12">
                    <table className="c-table">
                      <tbody>
                        {
                          gov.list.length
                            ? gov.list.map(b => <tr><td>{b}</td></tr>)
                            : <tr><td>Empty</td></tr>
                        }
                      </tbody>
                    </table>
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
    dcb: state.constant.dcb,
    cb: state.constant.cb,
    gov: state.constant.gov,
  }),
  ({
    actionGetDCB: getDCB,
    actionGetCB: getCB,
    actionGetGOV: getGOV,
  }),
)(Info);
