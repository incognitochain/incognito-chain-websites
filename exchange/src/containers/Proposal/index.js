import React, { Component } from 'react';
import { Icon, Row, Col, Modal as Modals } from 'antd';
import { connect } from 'react-redux';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import IntlMessages from '@ui/utility/intlMessages';
import message from '@ui/feedback/message';
import Scrollbars from '@ui/utility/customScrollBar.js';
import { InputSearch } from '@ui/uielements/input';
import Loader from '@ui/utility/loader';
import Input, { InputGroup, Textarea } from '@ui/uielements/input';
import Alert from "@ui/feedback/alert";
import Button from '@ui/uielements/button';

import Dropdown, { DropdownButtons,
  DropdownMenu,
  MenuItem,
  SubMenu } from '@ui/uielements/dropdown';

import WithDirection from "@/settings/withDirection";
import basicStyle from '@/settings/basicStyle';
import mailSelector from '@/redux/mail/selector';
import mailActions from '@/redux/mail/actions';

import PaginationControl from './applicant/mailPagination';
import singleMail from './applicant/singleMail';
import boardMail from './applicant/boardMail';
import mailList from './applicant/maiilList';
import MailPagination from './applicant/mailPagination.style';
import { ApplicantList, BioDetail } from "./style";
import voting from '@/services/Voting';
import auth from '@/services/Auth';
import ModalStyle, { MessageContent, ModalWrapper} from "./modal.style";

const {
  filterAction,
  selectMail,
  changeReplyMail,
  changeSearchString,
  storeMails
} = mailActions;

const showMessage = (msg, type='warning', time=2) => {

  if(type == 'success'){
    message.success(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
  else if(type == 'error'){
    message.error(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
  else{
    message.warning(
      <MessageContent>
        {msg}
      </MessageContent>,
      time
    );
  }
};

const Modal = WithDirection(ModalStyle(Modals));
class Proposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: this.props.searchString,
      loading: false,
      isVote: false,
      amount: '',
      selectedApplicant: false,
      boardType: {name: "DCB", value: 1},
    }
    
  }

  static defaultProps = {
    allMails: [],
  }

  componentDidMount(){
    this.getProposal();
  }

  async getProposal(boardType){
    if(!boardType) boardType = this.state.boardType;

    this.setState({loading: true});

    if(auth.isLogged()){console.log(boardType.value);
      const result = await voting.listProposal(boardType.value);
      if(result){
        this.props.storeMails(result);
      }
    } 
    this.setState({loading: false, boardType});
  }


  changeBoardType = (e) => {
    this.getProposal({name: e.item.props.value, value: Number(e.key)});
  };
  

  get menuClicked(){
    return (
      <DropdownMenu onClick={(e) => this.changeBoardType(e)}>
        <MenuItem key="1" value="DCB">DCB</MenuItem>
        <MenuItem key="2" value="GOV">GOV</MenuItem>
    </DropdownMenu>);
  }

  renderApplicants(){
    let {
      allMails,
      selectedMail,
      replyMail,
      selectMail,
      filterMails,
      filterAction,
      changeReplyMail,
      changeSearchString,
    } = this.props;

    const { search, boardType } = this.state;
    
    return (
      <ApplicantList>
        <div className="titleWrapper">
          <h3><IntlMessages id="Common.Proposals" /></h3>
            <Dropdown overlay={this.menuClicked}>
            <Button style={{padding: '0 0.5rem'}} >
              {boardType.name} <Icon type="down" />
            </Button>
          </Dropdown>
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
          {mailList(allMails, selectMail, selectedMail)}
        </Scrollbars>
      </ApplicantList>
    );
  }

  renderDetailBio(){
    let {
      allMails,
      selectedMail,
      selectMail,
      filterMails,
    } = this.props;

    let singleMailComponent = (
      <p className="isoNoMailMsg">
        <IntlMessages id="Proposal.UnselectApplicant" />
      </p>
    );
    
    let index = allMails.findIndex(mail => mail.ID === selectedMail);

    if (index !== -1) {
      singleMailComponent = singleMail(
        allMails,
        filterMails,
        index,
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
  
  renderDetailBoard(){
    let {
      allMails,
      selectedMail,
      selectMail,
      filterMails,
    } = this.props;

    let boardMailComponent = (
      <p className="isoNoMailMsg">
        <IntlMessages id="Proposal.UnselectApplicant" />
      </p>
    );
    
    let index = allMails.findIndex(mail => mail.ID === selectedMail);

    if (index !== -1) {
      boardMailComponent = boardMail(
        allMails,
        filterMails,
        index,
        selectMail,
        this.openVote
      );
    }
    
    return (
      <BioDetail>
        <Scrollbars style={{ height: this.props.height - 70 }}>
          {boardMailComponent}
        </Scrollbars>
      </BioDetail>
    );    
  }

  changeAmount = (e) => {console.log(e.target.value);
    this.setState({ amount: e.target.value });
  }

  handleCancel = () => {
    this.setState({ isVote: false, amount: ''});
  };

  openVote = (mail) => {
    if(auth.isLogged()){
      this.setState({isVote: true, selectedApplicant: mail});
    } 
    else{
      showMessage("Please sign in first");
    }
  }

  handleSubmitVote = async () => {
    const { amount, selectedApplicant } = this.state;
    
    if(!amount){
      showMessage('Please enter Amount!');
      return;
    }

    if(isNaN(amount)){
      showMessage('Amount is invalid!');
      return;
    }
    
    let result = await voting.voteProposal(1, selectedApplicant.ID, Number(amount));
    if(result){
      if(result.error){
        showMessage(result.message, 'error');
      }
      else{
        showMessage("success!", 'success');
      }
    }
    
    this.setState({ isVote: false, selectedApplicant: false, amount: ''});
  };

  renderVoteApplicant(){
    const { isVote, amount } = this.state;

    return (
      <Modal
          visible={isVote}
          title={<IntlMessages id="Voting.VoteApplicant" />}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>
              <IntlMessages id="Common.Cancel" />
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              loading={this.state.loading}
              onClick={this.handleSubmitVote}
            >
              <IntlMessages id="Common.Submit" />
            </Button>
          ]}
        >
          <ModalWrapper>
            <div><IntlMessages id="Common.Amount" /></div>
            <InputGroup >
              <Input onChange={(e) => this.changeAmount(e)} value={amount} />
            </InputGroup>
          </ModalWrapper>
          <Alert
            message={"This is alert for this modal. It should write someithng as enter amount before vote this applicant."}
            type="warning"
            style={{marginBottom: "10px"}}
          />
        </Modal>
    );
  }


  render() {
    const { rowStyle, colStyle, colStyle0, gutter } = basicStyle;
    const { search, loading } = this.state;

    if(loading)
      return <Loader />;

    return (
      <LayoutWrapper>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={6} sm={24} xs={24} style={colStyle0}>
            {
              this.renderApplicants()
            }
          </Col>
          <Col md={12} sm={24} xs={24} style={colStyle0}>
            {
              this.renderDetailBio()
            }
          </Col>
          <Col md={6} sm={24} xs={24} style={colStyle0}>
            {
              this.renderDetailBoard()
            }
          </Col>
        </Row>
          {
            this.renderVoteApplicant()
          }
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
    ...state.App,
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
  storeMails
})(Proposal);

