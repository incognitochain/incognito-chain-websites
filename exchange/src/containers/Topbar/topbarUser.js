import React, {Component} from 'react';
import userpic from '@/image/user1.png';
import {connect} from 'react-redux';
import Popover from '@ui/uielements/popover';
import IntlMessages from '@ui/utility/intlMessages';
import authAction from '../../redux/auth/actions';
import TopbarDropdownWrapper from './topbarDropdown.style';
import TopbarUserWrapper, {PopconfirmWrapper} from './topbarUser.style';
import Button from '@ui/uielements/button';
import actions from '@/redux/languageSwitcher/actions';
import config from './language.config';
import auth from '@ui/auth';
import Cookies from 'js-cookie';
import Popconfirms from '@ui/feedback/popconfirm';

const {logout} = authAction;
const {changeLanguage} = actions;

const Popconfirm = props => (
  <PopconfirmWrapper>
    <Popconfirms {...props} />
  </PopconfirmWrapper>
);

class TopbarUser extends Component {
  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.state = {
      isLang: false,
      isLogged: false,
      auth: false,
    };
  }

  componentDidMount() {
    this.setState({auth: auth.isLogged()});
  }

  hide() {
    this.setState({isLang: false, isLogged: false});
  }

  onSignin() {
    window.location.href = process.env.userUrl;
  }

  onSignup() {
    window.location.href = process.env.userUrl + '/register';
  }

  onLogout() {
    Cookies.remove('user', {domain: process.env.domain, path: '/'});
    window.location.assign('/');
  }

  handleLanguageChange = () => {
    this.setState({isLang: !this.state.isLang});
  }

  get login() {

    return <TopbarUserWrapper>
      <Popover
        content={this.popupLogin}
        trigger="click"
        visible={this.state.isLogged}
        onVisibleChange={() => this.setState({isLogged: !this.state.isLogged})}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <div className="isoImgWrapper">
          <img alt="user" src={userpic}/>
          <span className="userActivity online"/>
        </div>
      </Popover>

      {/*<Popover
        content={this.popupLanguage}
        trigger="click"
        visible={this.state.isLang}
        onVisibleChange={() => this.setState({ isLang: !this.state.isLang })}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <Button type="default" className="btnLanguage" >
          <IntlMessages id="topbar.Language" />
        </Button>
      </Popover>*/}

    </TopbarUserWrapper>
  }

  get unlogin() {

    return <TopbarUserWrapper>
      <Button type="primary" className="btnSignin" onClick={this.onSignin}>
        <IntlMessages id="topbar.Signin"/>
      </Button>

      <Button type="primary" className="btnSignup" onClick={this.onSignup}>
        <IntlMessages id="topbar.Signup"/>
      </Button>

      {/*<Popover
        content={this.popupLanguage}
        trigger="click"
        visible={this.state.isLang}
        onVisibleChange={() => this.handleLanguageChange()}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <Button type="default" className="btnLanguage" >
          <IntlMessages id="topbar.Language" />
        </Button>
      </Popover>*/}

    </TopbarUserWrapper>
  }

  get popupLogin() {
    return (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {/*<a className="isoDropdownLink" href="/profile">
          Profile
        </a>*/}
        <a className="isoDropdownLink" href="# ">
          <IntlMessages id="topbar.Settings"/>
        </a>
        {/*<a className="isoDropdownLink" href="# ">
          <IntlMessages id="topbar.Feedback"/>
        </a>*/}
        {/*<a className="isoDropdownLink" href="# ">
          <IntlMessages id="topbar.Help"/>
        </a>*/}
        <Popconfirm
          placement="bottomRight"
          title="Are you sure to logout？"
          okText="Yes"
          cancelText="No"
          onConfirm={this.onLogout}
          //onCancel={cancel}
        >
          <a className="isoDropdownLink" onClick={this.props.logout} href="# ">
            <IntlMessages id="topbar.Logout"/>
          </a>
        </Popconfirm>
      </TopbarDropdownWrapper>
    );
  }

  get popupLanguage() {
    const {changeLanguage} = this.props;

    return (
      <TopbarDropdownWrapper className="isoUserDropdown">
        {config.options.map(option => {
          const {languageId, icon} = option;
          return (
            <a className="lnkLanguage" href="#" key={languageId} onClick={() => changeLanguage(languageId)}>
              <img src={process.env.PUBLIC_URL + icon} alt="flag" width={24}/> {option.text}
            </a>
          );
        })}
        {/*  */}
      </TopbarDropdownWrapper>
    );
  }

  render() {
    const {auth} = this.state;

    return (auth ? this.login : this.unlogin);

  }
}

export default connect(
  state => ({
    ...state.TopbarUser,
  }),
  {changeLanguage}
)(TopbarUser);
