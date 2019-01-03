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
import AppLocale from "@/languageProvider";
import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import { Row, Col, Modal as Modals } from 'antd';
import basicStyle from '@/settings/basicStyle';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';
import IntlMessages from '@ui/utility/intlMessages';
import WithDirection from "@/settings/withDirection";
import ModalStyle from "./modal.style";
import Input, { InputGroup, Textarea } from '@ui/uielements/input';
import Alert from "@ui/feedback/alert";
import BioInfo from '@/modules/Home/BioInfo';
import RequestBanner from '@/modules/Home/RequestBanner';
import Information from '@/modules/Home/Infomation';
import LoanList from '@/modules/Home/LoanList';

import { connect } from "react-redux";

import {
  loadLoansSelector,
} from '@/reducers/home/selector';

import {
  loadLoanList,
} from '@/reducers/home/action';
import Topbar from '@/components/Topbar/Topbar';
import { IntlProvider } from 'react-intl';
import { Layout, LocaleProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import authAction from '@/reducers/auth/actions';
import appActions from '@/reducers/app/action';
import themes from '@/settings/themes';
import { themeConfig } from '@/settings';
import AppHolder from '@/components/App/commonStyle';
import { siteConfig } from '@/settings';
import config, {
  getCurrentLanguage
} from "@/components/LanguageSwitcher/config";

// 0xbatutut

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import Link from '@/components/Link';
import bgImage from '@/assets/create-a-proposal.svg';
import bgApplyGOV from '@/assets/apply-gov.svg';
import bgApplyDCB from '@/assets/apply-dcb.svg';
import bgApplyMCB from '@/assets/apply-mcb.svg';

const Modal = WithDirection(ModalStyle(Modals));

const { Content, Footer } = Layout;
const { logout } = authAction;
const { toggleAll } = appActions;
const customizedTheme = themes[themeConfig.theme];

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
      isShowConfirmPass: false,
      address: '',
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

  handleLoanListRowClick = (record) => {
    this.props.history.push(`/loan/:${record.ID}`);
  }

  renderProposal() {
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
              <Input onChange={(e) => this.setState({ nameProposal: e.target.value })} value={nameProposal} />
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

  renderEditBio() {
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
          style={{ marginBottom: "10px" }}
        />
      </Modal>
    );
  }

  renderApplyBoard() {
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
          style={{ marginBottom: "10px" }}
        />
      </Modal>
    );
  }

  componentDidMount() {
    const { auth } = this.state;
    if (!auth) {
      window.location.assign('http://auth.constant.money/login');
    } else {
      this.props.dispatch(loadLoanList());

    }
  }

  renderBioInfo() {
    const { boards, user, loading } = this.state;
    const { rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter } = basicStyle;

    return (
      <Col md={16} sm={24} xs={24} style={colStyle} className="col">
        <BioInfo
          user={user}
        />
      </Col>
    );
  }

  renderBanner() {
    const { boards, user, loading } = this.state;
    const { rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter } = basicStyle;

    return (
      <Col md={8} sm={24} xs={24} style={colStyle}>
        <RequestBanner />
      </Col>
    );
  }


  renderInformation() {
    const { boards } = this.state;
    const { rowStyle, gutter } = basicStyle;
    return (
      <Information />
    );
  }

  renderListRequest() {
    return (
      <LoanList
        list={props.loanList}
        onRowClick={this.handleLoanListRowClick}
        onWithdrawClick={this.showConfirmPassModal}
      />
    );
  }

  renderShare() {
    return (
      <ShareWrapper>
        <h3><IntlMessages id="Common.Share" /></h3>
        <Button type="default" className="">
          <IntlMessages id="Common.Facebook" />
        </Button>
        <Button type="default" className="">
          <IntlMessages id="Common.Twitter" />
        </Button>
        <Button type="default" className="">
          <IntlMessages id="Common.CopyLink" />
        </Button>

      </ShareWrapper>
    );
  }


  showConfirmPassModal = () => {
    console.log('showConfirmPassModal');
    this.setState({
      isShowConfirmPass: true,
    });
  }

  handleConfirmPassOk = (e) => {
    console.log(e);
    this.setState({
      isShowConfirmPass: false,
    });
  }

  handleConfirmPassCancel = (e) => {
    console.log(e);
    this.setState({
      isShowConfirmPass: false,
    });
  }

  onChangeConfirmPass = (event) => {
    const text = event.target.value;
  }

  renderModalConfirmPass() {
    const { isShowConfirmPass } = this.state;
    return (
      <Modal
        title="Confirm your password"
        visible={isShowConfirmPass}
        onOk={this.handleConfirmPassOk}
        onCancel={this.handleConfirmPassCancel}

      >
        <div className="wrapperConfirmPass">
          <div>Please confirm your password</div>
          <Input
            placeholder="Your Password"
            type="password"
            onChange={this.onChangeConfirmPass}
          />
        </div>
      </Modal>
    );
  }


  render() {
    const url = window.location.href;
    const { selectedTheme, height } = this.props;
    const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];

    const appHeight = window.innerHeight;
    const { boards, user, loading, auth } = this.state;
    const { rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter } = basicStyle;
    return (
      <FixedContainer>
        <LayoutWrapper>
          <Row style={rowStyle} gutter={gutter} justify="start">
            {this.renderBioInfo()}
            {this.renderBanner()}
          </Row>
          {this.renderInformation()}
          {this.renderListRequest(this.props)}
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
          { this.renderModalConfirmPass() }
        </LayoutWrapper>
      </FixedContainer>
    );
  }
}

export default connect(
  state => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height,
    loanList: loadLoansSelector(state),

  }),
)(Home);
