import React, { Component } from 'react';
import { Icon, Row, Col } from 'antd';
import { connect } from 'react-redux';
import Popover from 'core-components/uielements/popover';
import IntlMessages from 'core-components/utility/intlMessages';
import authAction from '../../redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import TopbarUserWrapper from './topbarUser.style';
import ContentHolder from 'core-components/utility/contentHolder';
import Button from 'core-components/uielements/button';
import actions from '../../redux/languageSwitcher/actions';
import config from './language.config';

const { logout } = authAction;
const { changeLanguage } = actions;

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false,
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    const { locale:language, changeLanguage } = this.props;

    const content = (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {config.options.map(option => {
          const { languageId, icon } = option;
          const customClass = 
            languageId === language.languageId
              ? 'selectedTheme languageSwitch'
              : 'languageSwitch';

          return (
            <a className="lnkLanguage" href="#" key={languageId} onClick={() => changeLanguage(languageId) }>
              <img src={process.env.PUBLIC_URL + icon} alt="flag" width={24} /> {option.text}
            </a>
          );
        })}
        {/* <a className="isoDropdownLink" href="# ">
          <IntlMessages id="themeSwitcher.settings" />
        </a>
        <a className="isoDropdownLink" href="# ">
          <IntlMessages id="sidebar.feedback" />
        </a>
        <a className="isoDropdownLink" href="# ">
          <IntlMessages id="topbar.help" />
        </a>
        <a className="isoDropdownLink" onClick={this.props.logout} href="# ">
          <IntlMessages id="topbar.logout" />
        </a> */}
      </TopbarDropdownWrapper>
    );

    const unlogin = (
        <TopbarUserWrapper>
          <Button type="primary" className="btnSignin" >
            <IntlMessages id="topbar.Signin" />
          </Button>

          <Button type="primary" className="btnSignup" >
            <IntlMessages id="topbar.Signup" />
          </Button>
          
          <Popover
            content={content}
            trigger="click"
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            arrowPointAtCenter={true}
            placement="bottomLeft"
          >
            <Button type="default" className="btnLanguage" >
              <IntlMessages id="topbar.Language" />
            </Button>
          </Popover>

        </TopbarUserWrapper>
    );

    return (unlogin);
    // return (
    //   <Popover
    //     content={content}
    //     trigger="click"
    //     visible={this.state.visible}
    //     onVisibleChange={this.handleVisibleChange}
    //     arrowPointAtCenter={true}
    //     placement="bottomLeft"
    //   >
    //     <div className="isoImgWrapper">
    //       <img alt="user" src={userpic} />
    //       <span className="userActivity online" />
    //     </div>
    //   </Popover>
    // );
  }
}

export default connect(
  state => ({
    ...state.TopbarUser,
  }),
  { changeLanguage }
)(TopbarUser);
