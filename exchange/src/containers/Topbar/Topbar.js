import React, {Component} from "react";
import {connect} from "react-redux";
import {Layout} from "antd";
import appActions from "../../redux/app/actions";
import TopbarUser from "./topbarUser";
import TopbarWrapper from "./topbar.style";
import Sidebar from "../Sidebar/Sidebar";

const {Header} = Layout;
const {toggleCollapsed} = appActions;

class Topbar extends Component {
  render() {
    const {url, customizedTheme, locale} = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: "fixed",
      width: "100%",
      height: 50
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
          }
        >
          <Sidebar url={url} locale={locale}/>
          <ul className="isoRight">
            <li
              onClick={() => this.setState({selectedItem: "user"})}
              className="isoUser"
            >
              <TopbarUser locale={locale}/>
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme
  }),
  {toggleCollapsed}
)(Topbar);
