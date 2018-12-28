import React from 'react';
import Cookies from 'js-cookie';
import {
  TableStyle,
  FixedContainer,
  ProposalBox,
  ShareWrapper,
  ApplyBoardWrapper,
  MessageContent,
  BioWrapper
} from "@/styles/custom.style";
import Tabs, { TabPane } from '@ui/uielements/tabs';

import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import {Row, Col, Modal as Modals} from 'antd';
import basicStyle from '@/settings/basicStyle';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';
import IntlMessages from '@ui/utility/intlMessages';
import WithDirection from "@/settings/withDirection";
import ModalStyle  from "./modal.style";
import Input, { InputGroup, Textarea } from '@ui/uielements/input';
import Alert from "@ui/feedback/alert";
import BioInfo from '@/modules/Home/BioInfo';

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
class Home extends React.Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    const auth = Cookies.get('auth');
    this.state = {
      auth,
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
    };
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

  componentDidMount() {
    const {auth} = this.state;
    if (!auth) {
      window.location.assign('http://auth.constant.money/login');
    }
  }

  renderBioInfo() {
    const {boards, user, loading} = this.state;
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;

    return (
      <Col md={16} sm={24} xs={24} style={colStyle} className="col">
        <BioInfo
          user={user}
        />
      </Col>
    );
  }

  renderBanner() {
    const {boards, user, loading} = this.state;
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;

    return (
      <Col md={8} sm={24} xs={24} style={colStyle} className="col">
            <Box style={boxStyle0}>
              <ProposalBox>
                <div className="desc">
                  <IntlMessages id="Portal.Home.Proposal.Description"/>
                  <br/><span className="create"><IntlMessages id="Common.CreateNewOne"/>.</span>
                </div>

                <div className="action">
                  <Button type="default" className="btn" style={{marginBottom: '1rem'}}
                          onClick={() => this.openProposal(1)}>
                    <IntlMessages id="Proposal.CreateDCB"/>
                  </Button>
                  <Button type="default" className="btn" onClick={() => this.openProposal(2)}>
                    <IntlMessages id="Proposal.CreateGOV"/>
                  </Button>
                </div>
              </ProposalBox>
            </Box>
      </Col>
    );
  }
  renderInfoItem(box) {
    const {boards, user, loading} = this.state;
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;
    return (
      <Col md={8} sm={24} xs={24} style={colStyle} key={box.key} className="col">
        <Box style={boxStyleBg(box.background)} className="cardBoard"
            title={<IntlMessages id={box.title}/>}
            subtitle={<IntlMessages id={box.subTitle}/>}
        >
          {
            box.applied ?
              <Button className="btnApplied">
                <IntlMessages id="Common.Applied"/>
              </Button>
              :
              <Button className="btnApply" onClick={() => this.openApplyBoard(box)}>
                <IntlMessages id={box.btnText}/>
              </Button>
          }
        </Box>
      </Col>);
  }

  renderInformation() {
    const { boards } = this.state;
    const { rowStyle, gutter } = basicStyle;
    return (
      <Row style={rowStyle} gutter={gutter}>
        {
          boards.map(box => this.renderInfoItem(box))
        }
      </Row>
    );
  }

  renderListRequest() {
    return (
      <TableStyle className="isoLayoutContent">
        <Tabs className="isoTableDisplayTab">
          {/*tableinfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              {this.renderTable(tableInfo)}
            </TabPane>
          ))*/}
        </Tabs>
      </TableStyle>
    );
  }

  renderShare() {
    return (
      <ShareWrapper>
        <h3><IntlMessages id="Common.Share"/></h3>
        <Button type="default" className="">
          <IntlMessages id="Common.Facebook"/>
        </Button>
        <Button type="default" className="">
          <IntlMessages id="Common.Twitter"/>
        </Button>
        <Button type="default" className="">
          <IntlMessages id="Common.CopyLink"/>
        </Button>

    </ShareWrapper>
    );
  }


  render() {
    const {boards, user, loading} = this.state;
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;
    return (
      <FixedContainer>
        <LayoutWrapper>
          <Row style={rowStyle} gutter={gutter} justify="start">
            {this.renderBioInfo()}
            {this.renderBanner()}
          </Row>
          {this.renderInformation()}
          {this.renderListRequest()}
          {this.renderShare()}
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

export default Home;
