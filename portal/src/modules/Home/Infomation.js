import React, { Component } from 'react';
import basicStyle from '@/settings/basicStyle';
import PropTypes from 'prop-types';
import Box from '@ui/utility/box';

import { Row, Col } from 'antd';

import './Information.scss';

const boards = [
  {
    key: 3,
    title: 'Withdraw Loan',
    subTitle: '50% discount',
  },
  {
    key: 1,
    title: "Buy Constant Token today",
    subTitle: "50% discount",

  },
  {
    key: 2,
    title: "Buy Constant Token today",
    subTitle: "50% discount",
  }
];


class InfoItem extends Component {
  static propTypes = {
    item: PropTypes.object
  }

  render() {
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;
    const { item } = this.props;
    return (
      <Col md={8} sm={24} xs={24} style={colStyle} key={item.key} className="col">
        <Box className="cardBoard">
          <div className="wrapperCard">
            <div>icon</div>
            <div className="container">
              <div className="title">{item.title}</div>
              <div className="subTitle">{item.subTitle}</div>
            </div>
          </div>

        </Box>
      </Col>
    );
  }
}

class Information extends Component {
  render(){
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;

    return (
      <Row style={rowStyle} gutter={gutter}>
        {
          boards.map((box, index)=> <InfoItem key={index} item={box} />)
        }
      </Row>
    );
  }
}
export default Information;
