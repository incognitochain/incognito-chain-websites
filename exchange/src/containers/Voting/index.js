import React, { Component } from 'react';
import Tabs, { TabPane } from '@ui/uielements/tabs';
import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import ContentHolder from '@ui/utility/contentHolder';
import IntlMessages from '@ui/utility/intlMessages';
import basicStyle from '@/settings/basicStyle';
import { Row, Col } from 'antd';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';

import PaginationControl from './application/mailPagination';
import mailSelector from '@/redux/mail/selector';
import singleMail from './application/singleMail';
import MailBox from './mailBox.style';
import { connect } from 'react-redux';
import mailActions from '@/redux/mail/actions';
import Scrollbars from '@ui/utility/customScrollBar.js';
import { InputSearch } from '@ui/uielements/input';
import mailList from './application/maiilList';
import { ApplicantList, BioDetail } from "./style";

const {
  filterAction,
  selectMail,
  changeComposeMail,
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
      changeComposeMail,
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
      composeMail,
      replyMail,
      selectMail,
      filterAction,
      changeComposeMail,
      changeReplyMail,
    } = this.props;
    const { search } = this.state;
    let singleMailComponent = (
      <p className="isoNoMailMsg">
        <IntlMessages id="Voting.UnselectAplication" />
      </p>
    );
    const index = allMails.findIndex(mail => mail.id === selectedMail);
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
    composeMail,
    replyMail,
    searchString,
  } = state.Mails;
  return {
    allMails,
    tag,
    selectedMail,
    filterAttr,
    composeMail,
    replyMail,
    searchString,
    filterMails: mailSelector(state.Mails),
  };
}


export default connect(mapStateToProps, {
  filterAction,
  selectMail,
  changeComposeMail,
  changeReplyMail,
  changeSearchString,
})(Voting);
