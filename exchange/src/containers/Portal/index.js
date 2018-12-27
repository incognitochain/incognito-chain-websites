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
import bgCMB from '@/image/portal-bg-cmb.png';

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
    description: "Apply DCB board for control our system base on role person in DCB. Constant provides a mechanism for legitimate exchange that also safeguards your privacy.",
    background: bgDCB,
    btnAction: "",
    btnStyle: "",
    btnText: "Common.NowApply",
    applied: false,
  },
  {
    key: 2,
    title: "Voting.Apply.Cmb.Title",
    subTitle: "Voting.Apply.Cmb.Description",
    description: "Apply CMB board for control our system base on role person in CMB. Constant provides a mechanism for legitimate exchange that also safeguards your privacy.",
    background: bgCMB,
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

      isProposal: false,
      nameProposal: '',
      selectedProposal: false,
      selectedProposalType: false,
    }
  }

  async componentDidMount(){
    if(auth.isLogged()){
      await this.myCandidate();
    } 

    this.setState({loading: false});
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
        else if(boards[i].key == 2 && result.CMB){
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
    this.setState({ isApplyBoard: false, applyBoard: false, address: '', 
      isEditBio: false, 
      isProposal: false, selectedProposal: false, selectedProposalType: false, nameProposal: ''});
  };

  changeAddress = (e) => {
    this.setState({ address: e.target.value });
  }

  changeBio = (e) => {
    this.setState({ bio: e.target.value });
  }

  changeProposal = (e, input) => {
    let value= e.target.value, selectedProposal = this.state.selectedProposal;
    
    for(let i in selectedProposal){
      if(selectedProposal[i].key === input.key){
        selectedProposal[i].value = value;
        break;
      }
    }
    
    this.setState({ selectedProposal });
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

  openProposal = async (boardType) => {
    if(auth.isLogged()){
      const result = await voting.createProposal(boardType);
      if(result){
        let selectedProposal = this.parseJsonMultiLevel(result);
        this.setState({selectedProposal, selectedProposalType: boardType, isProposal: true});
      }
    } 
    else{
      showMessage("Please sign in first");
    }
  }

  parseJsonMultiLevel(data){
    var result = [];
    
    function parseData(input, prefix){
      for(let index in input){
        if(typeof(input[index]) == "object"){
          parseData(input[index], index);
        }
        else{
          result.push({
            key: prefix ? prefix + "." + index : index, 
            name: index,
            value: input[index],
            type: typeof(input[index])
          });
        }
      }
    }
    
    parseData(data);

    return result;
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
      else{
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

  handleProposal = async () => {
    
    const { selectedProposal, nameProposal, selectedProposalType } = this.state;
    let required = [], invalid = [];
    for(let i of selectedProposal){
      if((i.type == "number" && i.value === "") || (i.type != "number" && !i.value)){
        required.push(i.name);
      }
      else if(i.type === 'number' && isNaN(i.value)){
        invalid.push(i.name);
      }
    }

    if(required.length){
      showMessage(`Please enter ${required.join(", ")}.`);
      return;
    }

    if(invalid.length){
      showMessage(`${invalid.join(", ")} are required input number.`);
      return;
    }
    
    let data = {};
    for(let i of selectedProposal){

      let arr = i.key.split(".");
      if(arr.length > 1){
        let sub = {}, key = arr[0];
        for(let x in arr){
          if(x == arr.length-1)
            sub = {[arr[x]] : i.value};
          else
            sub = {[arr[x]] : sub};
        }
        
        data[key] = {...data[key], ...sub};
      }
      else{
        data[i.key] = i.type == "number" ? Number(i.value) : i.value;
      }
    }

    let result = await voting.submitProposal(selectedProposalType, nameProposal, data);
    if(result){
      if(result.error){
        showMessage(result.message, 'error');
      }
      else{
        showMessage("success!", 'success');
        
      }
    }
    
    this.setState({ isProposal: false, selectedProposal: '', nameProposal: '', selectedProposalType:  false});
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

  renderProposal(){
    const { isProposal, selectedProposal, nameProposal } = this.state;

    return (
      <Modal
          visible={isProposal}
          title={<IntlMessages id="Proposal.CreateGOV" />}
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
              onClick={this.handleProposal}
            >
              <IntlMessages id="Common.Submit" />
            </Button>
          ]}
        >
          <div>
              <ApplyBoardWrapper key="Name">
                <div><IntlMessages id="Proposal.Name" /></div>
                <InputGroup >
                  <Input onChange={(e) => this.setState({ nameProposal: e.target.value})} value={nameProposal}/>
                </InputGroup>
              </ApplyBoardWrapper>
            {
              selectedProposal && selectedProposal.map(i => {

                return (
                  <ApplyBoardWrapper key={i.key}>
                    <div><IntlMessages id={"Proposal." + i.name} /></div>
                    <InputGroup >
                      <Input onChange={(e) => this.changeProposal(e, i)} value={i.value} />
                    </InputGroup>
                  </ApplyBoardWrapper>
                )
              })
            }
          </div>
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
            <Col md={16} sm={24} xs={24} style={colStyle} className="col">
              <Box className="mainBox"
                title={<IntlMessages id="Portal.Home.BigBox.Hello" />}
                subtitle={<span className="editBio" onClick={() => this.openEditBio()}>Edit</span>} >
                {
                  user && <div className="bio">{user.Bio}</div>
                }
              </Box>
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle} className="col">
              <Box style={boxStyle0}>
                <ProposalBox>
                  <div className="desc">
                    <IntlMessages id="Portal.Home.Proposal.Description" />
                    <br /><span className="create"><IntlMessages id="Common.CreateNewOne" />.</span>
                  </div>

                  <div className="action">
                    <Button type="default" className="btn" style={{marginBottom: '1rem'}} onClick={() => this.openProposal(1)}>
                      <IntlMessages id="Proposal.CreateDCB" />
                    </Button>
                    <Button type="default" className="btn" onClick={() => this.openProposal(2)}>
                      <IntlMessages id="Proposal.CreateGOV" />
                    </Button>
                  </div>
                </ProposalBox>
              </Box>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter}>
            {
              boards.map(box => {
                return (
                  <Col md={8} sm={24} xs={24} style={colStyle} key={box.key} className="col">
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
          {
            this.renderProposal()
          }
        </LayoutWrapper>
      </FixedContainer>
      
    );
  }
}
export { TableViews, tableinfos, Data };
