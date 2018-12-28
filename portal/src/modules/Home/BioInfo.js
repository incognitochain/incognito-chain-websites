import React, { Component } from "react";
import PropTypes from 'prop-types';

import Box from '@ui/utility/box';
import IntlMessages from '@ui/utility/intlMessages';
import BioInfoMoney from './BioInfoMoney';
import {Row, Col, Modal as Modals} from 'antd';

const availableLoan = {
  symbol: 'CST',
  total: 12556,
  name: 'Available loan',
  colorClass: 'green',
};

const lended = {
  symbol: 'CST',
  total: 8280,
  name: 'has been lended',
  colorClass: 'blue',
};

const loanLimit = {
  symbol: 'CST',
  total: 0,
  name: 'Total loan limit',
  colorClass: 'blue',
};

const hold = {
  symbol: 'ETH',
  total: 2556,
  name: 'has been hold',
  colorClass: 'blue',
};


class BioInfo extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  static defaultProps = {
  }

  getTitle = (user) => {
    const name = "John"
    return <span className="bioTitle"><IntlMessages id="Portal.Home.BigBox.Hello"/> {name}</span>
  }

  renderBioInfoMoney(item) {
    return (
      <Col>
        <BioInfoMoney item = {item} primaryColor={item.colorClass}/>
      </Col>
    )
  }

  render() {
    const { user } = this.props;
    return (
      <Box className="mainBox"
          title={this.getTitle(user)}
      >
        <Row>
          {this.renderBioInfoMoney(availableLoan)}
          {this.renderBioInfoMoney(lended)}
          {this.renderBioInfoMoney(loanLimit)}
          {this.renderBioInfoMoney(hold)}
        </Row>
      </Box>
    );
  }
}
export default BioInfo;
