import React, { Component } from 'react';
import { Row, Col, Modal as Modals } from 'antd';

import Tabs, { TabPane } from '@ui/uielements/tabs';
import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import Alert from "@ui/feedback/alert";
import IntlMessages from '@ui/utility/intlMessages';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';
import Input, { InputGroup, Textarea } from '@ui/uielements/input';
import message from '@ui/feedback/message';
import Loader from '@ui/utility/loader';

import WithDirection from "@/settings/withDirection";
import basicStyle from '@/settings/basicStyle';
import voting from '@/services/Voting';
import auth from '@/services/Auth';

import ModalStyle  from "./modal.style";

import Data from './data';
import { tableinfos } from './configs';
import * as TableViews from './tableViews/';
import { TableStyle, FixedContainer, ProposalBox, ShareWrapper, ApplyBoardWrapper, MessageContent, BioWrapper } from "./custom.style";

import bgGOV from '@/image/portal-bg-gov.png';
import bgDCB from '@/image/portal-bg-dcb.png';
import bgMCB from '@/image/portal-bg-mcb.png';

const Modal = WithDirection(ModalStyle(Modals));

const dataBoards = [
  {
    key: 3,
    title: "Voting.Apply.Gov.Title",
    subTitle: "Voting.Apply.Gov.Description",
    description: "Apply GOV board for control our system base on role person in Goverment. Constant provides a mechanism for legitimate exchange that also safeguards your privacy.",
    background: bgGOV,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply",
    applied: false,
  },
  {
    key: 1,
    title: "Voting.Apply.Dcb.Title",
    subTitle: "Voting.Apply.Dcb.Description",
    description: "Apply DCB board for control our system base on role person in DCB. Constant provides a mechanism for legitimate exchange that also safeguards your privacy.",
    background: bgDCB,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply",
    applied: false,
  },
  {
    key: 2,
    title: "Voting.Apply.Mcb.Title",
    subTitle: "Voting.Apply.Mcb.Description",
    description: "Apply MCB board for control our system base on role person in MCB. Constant provides a mechanism for legitimate exchange that also safeguards your privacy.",
    background: bgMCB,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply",
    applied: false,
  }
];

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

export default class Portal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: false,
      isApplyBoard: false,
      applyBoard: false,
      address: '',
      boards: dataBoards,
      user: false,
      token: false,
      loading: true,
      bio: '',
    }
  }

  async componentDidMount(){
    const token = auth.isLogged();
    let paymentAddress = "", listBalances = [];

    if(token){
      await this.myCandidate();
    }
    
    this.setState({auth: token, loading: false});
  }

  async myCandidate(){
    let { boards } = this.state;
    let result = await voting.myCandidate();
    if(!result.Error){
      let user = result.User;
      for(let i in boards){
        if(boards[i].key == 1 && result.DCB){
          boards[i].applied = true;
        }
        else if(boards[i].key == 2 && result.MCB){
          boards[i].applied = true;
        }
        else if(boards[i].key == 3 && result.GOV){
          boards[i].applied = true;
        }
      }

      this.setState({boards, user});
    }
    else{
      //return false;
    }
  }

  handleCancel = () => {
    this.setState({ isApplyBoard: false, isEditBio: false, applyBoard: false, address: '' });
  };

  changeAddress = (e) => {
    this.setState({ address: e.target.value });
  }

  changeBio = (e) => {
    this.setState({ bio: e.target.value });
  }

  openApplyBoard = (box) => {
    if(auth.isLogged()){
      this.setState({isApplyBoard: true, applyBoard: box});
    } 
    else{
      showMessage("Please sign in first");
    }
  }

  openEditBio = () => {
    if(auth.isLogged()){
      const { bio, user } = this.state;
      this.setState({isEditBio: true, bio: bio ? bio : user.Bio});
    } 
    else{
      showMessage("Please sign in first");
    }
  }

  handleApplyBoard = async () => {
    
    const { address, applyBoard, boards } = this.state;
    
    if(!address){
      showMessage('Please enter Payment Address!');
      return;
    }
    
    let result = await voting.createCandidate(address, applyBoard.key);
    if(result){
      if(result.error){
        showMessage(result.message, 'error');
      }
      else{console.log(boards);
        showMessage("success!", 'success');
        for(let i in boards){
          if(boards[i].key == applyBoard.key){
            boards[i].applied = true;
            break;
          }
        }

        this.setState({boards});
      }
    }
    
    this.setState({ isApplyBoard: false, applyBoard: false, address: ''});
  };

  handleBio = async () => {
    
    const { bio, user  } = this.state;
    
    if(!bio){
      showMessage('Please enter bio!');
      return;
    }
    
    let result = await auth.update({Bio: bio});
    if(result){
      if(result.error){
        showMessage(result.message, 'error');
      }
      else{
        showMessage("success!", 'success');
        user.Bio = bio;
        this.setState({user});
      }
    }
    
    this.setState({ isEditBio: false, bio: ''});
  };

  renderTable(tableInfo) {
    const { dataList } = this.state;
    if(dataList && dataList[tableInfo.value]){
      const data = new Data(10, dataList[tableInfo.value]);

      let Component;
      switch (tableInfo.value) {
        case '1h':
          Component = TableViews.oneHour;
          break;
        case '4h':
          Component = TableViews.fourHours;
          break;
        default:
          Component = TableViews.day;
      }
      return <Component tableInfo={tableInfo} dataList={data} />;
    }
    else{
      return <p><IntlMessages id="Market.DataNotFound" /></p>;
    }

  }


  renderEditBio(){
    const { isEditBio, bio } = this.state;

    return (
      <Modal
          visible={isEditBio}
          title={<IntlMessages id="Voting.EditBio" />}
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
              onClick={this.handleBio}
            >
              <IntlMessages id="Common.Save" />
            </Button>
          ]}
        >
          <div>
            <InputGroup >
              <Textarea placeholder="Enter your bio" onChange={(e) => this.changeBio(e)} value={bio} rows={5} />
            </InputGroup>
          </div>
          <Alert
            message="The bio would be helped the Reviewer understand your decision and what things you will do."
            type="warning"
            style={{marginBottom: "10px"}}
          />
        </Modal>
    );
  }

  renderApplyBoard(){
    const { isApplyBoard, applyBoard, address } = this.state;
    const title = applyBoard ? <IntlMessages id={applyBoard.title} /> : "";

    return (
      <Modal
          visible={isApplyBoard}
          title={title}
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
              onClick={this.handleApplyBoard}
            >
              <IntlMessages id="Common.Submit" />
            </Button>
          ]}
        >
          <ApplyBoardWrapper>
            <div><IntlMessages id="Voting.Apply.Address" /></div>
            <InputGroup >
              <Input onChange={(e) => this.changeAddress(e)} value={address} />
            </InputGroup>
          </ApplyBoardWrapper>
          <Alert
            message={applyBoard.description}
            type="warning"
            style={{marginBottom: "10px"}}
          />
        </Modal>
    );
  }

  render() {
    const { boards, user, loading } = this.state;
    const { rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter } = basicStyle;
    
    if(loading)
      return <Loader />;

    return (
      <FixedContainer>
        <LayoutWrapper>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={16} sm={24} xs={24} style={colStyle}>
              <Box className="mainBox"
                title={<IntlMessages id="Portal.Home.BigBox.Hello" />}
                subtitle={<span className="editBio" onClick={() => this.openEditBio()}>Edit</span>} >
                {
                  user && <div className="bio">{user.Bio}</div>
                }
              </Box>
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle0}>
              <Box style={boxStyle0}>
                <ProposalBox>
                  <div className="desc"><IntlMessages id="Portal.Home.Proposal.Description" /></div>
                  <Button type="default" className="btn" >
                    <IntlMessages id="Portal.Home.Proposal.Create" />
                  </Button>
                </ProposalBox>
              </Box>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter}>
            {
              boards.map(box => {
                return (
                  <Col md={8} sm={24} xs={24} style={colStyle} key={box.key}>
                  <Box style={boxStyleBg(box.background)} className="cardBoard"
                    title={<IntlMessages id={box.title} />}
                    subtitle={<IntlMessages id={box.subTitle} />} 
                    >
                    {
                      box.applied ? 
                      <Button className="btnApplied"   >
                        <IntlMessages id="Common.Applied" />
                      </Button>
                      :
                      <Button className="btnApply"  onClick={() => this.openApplyBoard(box)}>
                        <IntlMessages id={box.btnText} />
                      </Button>
                    }
                  </Box>
                </Col>);
              })
            }
          </Row>
          <TableStyle className="isoLayoutContent">
            <Tabs className="isoTableDisplayTab">
              {tableinfos.map(tableInfo => (
                <TabPane tab={tableInfo.title} key={tableInfo.value}>
                  {this.renderTable(tableInfo)}
                </TabPane>
              ))}
            </Tabs>
          </TableStyle>
          <ShareWrapper>
            <h3><IntlMessages id="Common.Share" /></h3>
            <Button type="default" className="" >
              <IntlMessages id="Common.Facebook" />
            </Button>
            <Button type="default" className="" >
              <IntlMessages id="Common.Twitter" />
            </Button>
            <Button type="default" className="" >
              <IntlMessages id="Common.CopyLink" />
            </Button>

          </ShareWrapper>
          {
            this.renderApplyBoard()
          }
          {
            this.renderEditBio()
          }
        </LayoutWrapper>
      </FixedContainer>
      
    );
  }
}
export { TableViews, tableinfos, Data };
