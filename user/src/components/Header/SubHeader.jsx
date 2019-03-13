import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Link from "components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faWallet,
  faCog,
  faPollH,
  faBallotCheck
} from "@fortawesome/pro-light-svg-icons";
import cn from "classnames";

class SubHeader extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    show: true
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { show, router } = this.props;
    const { location } = router;
    const { pathname } = location;

    return (
      <header
        className="c-sub-header"
        style={{ display: `${show ? "block" : "none"}` }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul>
                <li>
                  <Link to="/" className={cn({ active: pathname === "/" })}>
                    <FontAwesomeIcon icon={faUserAlt} />
                    {" Profile"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wallet"
                    className={cn({ active: pathname.startsWith("/wallet") })}
                  >
                    <FontAwesomeIcon icon={faWallet} />
                    {" Wallet"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/voting"
                    className={cn({ active: pathname.startsWith("/voting") })}
                  >
                    <FontAwesomeIcon icon={faPollH} />
                    {" Voting"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/proposals"
                    className={cn({
                      active: pathname.startsWith("/proposals")
                    })}
                  >
                    <FontAwesomeIcon icon={faBallotCheck} />
                    {" Proposal"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/setting"
                    className={cn({ active: pathname.startsWith("/setting") })}
                  >
                    <FontAwesomeIcon icon={faCog} />
                    {" Setting"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/kyc"
                    className={cn({ active: pathname.startsWith("/kyc") })}
                  >
                    <FontAwesomeIcon icon={faUserAlt} />
                    {" Kyc"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({ router: state.router }))(SubHeader);
