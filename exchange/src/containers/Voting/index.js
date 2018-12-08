import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import IntlMessages from '@ui/utility/intlMessages';
import Box from '@ui/utility/box';
import Scrollbars from '@ui/utility/customScrollBar.js';
import { InputSearch } from '@ui/uielements/input';

import basicStyle from '@/settings/basicStyle';

import mailSelector from '@/redux/mail/selector';
import mailActions from '@/redux/mail/actions';

import PaginationControl from './application/mailPagination';
import singleMail from './application/singleMail';
import mailList from './application/maiilList';
import { ApplicantList, BioDetail } from "./style";

const {
  filterAction,
  selectMail,
  changeReplyMail,
  changeSearchString,
} = mailActions;

class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchString,
    }
  }

  componentDidMount(){
   
  }

  renderApplications(){
    const {
      allMails,
      selectedMail,
      replyMail,
      selectMail,
      filterMails,
      filterAction,
      changeReplyMail,
      changeSearchString,
    } = this.props;

    const { search } = this.state;

    return (
      <ApplicantList>
        <div className="titleWrapper">
          <h3><IntlMessages id="Voting.Applicants" /></h3>
          <PaginationControl />
        </div>
        <div className="searchWrapper">
          <InputSearch
            placeholder="Search Email"
            value={search}
            className="isoSearchEmail"
            onChange={event =>
              this.setState({ search: event.target.value })
            }
            onSearch={value => changeSearchString(value)}
          />
        </div>
        <Scrollbars>
          {mailList(filterMails, selectMail, selectedMail)}
        </Scrollbars>
      </ApplicantList>
    );
  }

  renderDetailBio(){
    const {
      allMails,
      filterAttr,
      filterMails,
      selectedMail,
      replyMail,
      selectMail,
      filterAction,
      changeReplyMail,
    } = this.props;
    const { search } = this.state;
    let singleMailComponent = (
      <p className="isoNoMailMsg">
        <IntlMessages id="Voting.UnselectAplication" />
      </p>
    );
    const index = allMails.findIndex(mail => mail.ID === selectedMail);
    if (index !== -1) {
      singleMailComponent = singleMail(
        allMails,
        filterMails,
        index,
        replyMail,
        changeReplyMail,
        selectMail
      );
    }

    return (
      <BioDetail>
        <Scrollbars style={{ height: this.props.height - 70 }}>
          {singleMailComponent}
        </Scrollbars>
      </BioDetail>
    );    
  }
  
  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;

    return (
      <LayoutWrapper>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={6} sm={24} xs={24} style={colStyle}>
            {/* <ApplicantWrapper>
              <Box
                title={<IntlMessages id="Voting.Applicants" />}
                >
                  <div className="item">
                    <div className="name">Eric Hoffman</div>
                    <div className="bio">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam</div>
                  </div>
              </Box>
            </ApplicantWrapper> */}

            {
              this.renderApplications()
            }
          </Col>
          <Col md={12} sm={24} xs={24} style={colStyle}>
            {
              this.renderDetailBio()
            }
          </Col>
          <Col md={6} sm={24} xs={24} style={colStyle}>
            <Box 
              >
            </Box>
          </Col>
        </Row>
      </LayoutWrapper>
      
    );
  }
}


function mapStateToProps(state) {
  const {
    allMails,
    tag,
    selectedMail,
    filterAttr,
    replyMail,
    searchString,
  } = state.Mails;
  return {
    allMails,
    tag,
    selectedMail,
    filterAttr,
    replyMail,
    searchString,
    filterMails: mailSelector(state.Mails),
  };
}


export default connect(mapStateToProps, {
  filterAction,
  selectMail,
  changeReplyMail,
  changeSearchString,
})(Voting);
