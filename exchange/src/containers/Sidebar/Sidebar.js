import React, {Component} from "react";
import {connect} from "react-redux";
import clone from "clone";
import {Link} from "react-router-dom";
import {Layout} from "antd";
import Scrollbars from "@ui/utility/customScrollBar.js";
import Menu from "@ui/uielements/menu";
import {Dropdown, Icon} from "antd";

import IntlMessages from "@ui/utility/intlMessages";
import SidebarWrapper from "./sidebar.style";
import appActions from "../../redux/app/actions";
import Logo from "@ui/utility/logo";
import themes from "@/settings/themes";
import {themeConfig} from "../../settings";
import {Row, Col} from "antd";
import ContentHolder from "@ui/utility/contentHolder";
import imgLogo from "@/image/logo.png";
import {siteConfig} from "@/settings";
import {Button} from "antd";

const {Sider} = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVoting: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === "MobileView") {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }

  onOpenChange(newOpenKeys) {
    const {app, changeOpenKeys} = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  getAncestorKeys = key => {
    const map = {
      sub3: ["sub2"]
    };
    return map[key] || [];
  };

  getSubMenuItem(child, submenuColor, submenuStyle) {
    const linkTo = child.withoutDashboard ? `/${child.key}` : `/${child.key}`;
    return (
      <Menu.Item key={child.key}>
        <Link style={submenuColor} to={linkTo}>
          <IntlMessages id={child.label}/>
        </Link>
      </Menu.Item>
    );
  }

  getSubMenu = (children, submenuColor, submenuStyle) => {
    return (
      <Menu>
        {children.map(item =>
          this.getSubMenuItem(item, submenuColor, submenuStyle)
        )}
      </Menu>
    );
  };

  renderMainMenuText({submenuColor, label, key}) {
    return (
      <Link to={`/${key}`}>
        <span className="isoMenuHolder" style={submenuColor}>
          <span className="nav-text">
            <IntlMessages id={label}/>
          </span>
        </span>
      </Link>
    );
  }

  renderDropdownMainMenuText({
                               submenuStyle,
                               submenuColor,
                               children,
                               label,
                               key
                             }) {
    return (
      <Link to={`/${key}`}>
        <Dropdown
          overlay={this.getSubMenu(children, submenuColor, submenuStyle)}
        >
          <Button className="sub-menu-button">
            <IntlMessages id={label}/>
            <Icon type="down"/>
          </Button>
        </Dropdown>
      </Link>
    );
  }

  getMenuItem = ({singleOption, submenuStyle, submenuColor}) => {
    const {key, label, children} = singleOption;

    return (
      <Menu.Item key={key} style={{width: "0px"}}>
        {children
          ? this.renderDropdownMainMenuText({
            submenuStyle,
            submenuColor,
            children,
            label,
            key
          })
          : this.renderMainMenuText({submenuColor, label, key})}
      </Menu.Item>
    );
  };

  render() {
    const {app, toggleOpenDrawer} = this.props;
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const {openDrawer} = app;
    const mode = collapsed === true ? "horizontal" : "inline";
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const customizedTheme = themes[themeConfig.theme];
    const styling = {
      backgroundColor: customizedTheme.backgroundColor
    };
    const submenuStyle = {
      backgroundColor: "rgba(0,0,0,0.3)",
      color: customizedTheme.textColor
    };
    const submenuColor = {
      color: customizedTheme.textColor
    };
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width={"100%"}
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Row>
            <ContentHolder style={{overflow: "hidden", margin: 0}}>
              <Col lg={4} md={4} sm={6} xs={4}>
                <Logo
                  collapsed={collapsed}
                  siteConfig={siteConfig}
                  logo={imgLogo}
                />
              </Col>
              <Col lg={20} md={20} sm={18} xs={20}>
                <Scrollbars style={{height: 50}}>
                  <Menu
                    onClick={this.handleClick}
                    theme="dark"
                    className="isoDashboardMenu"
                    mode={mode}
                    openKeys={collapsed ? [] : app.openKeys}
                    selectedKeys={app.current}
                    onOpenChange={this.onOpenChange}
                  >
                    <Menu.Item>
                      <a href={`${process.env.userUrl}`}>
                        <span className="isoMenuHolder" style={submenuColor}>
                          <span className="nav-text">User</span>
                        </span>
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`${process.env.explorerUrl}`}>
                        <span className="isoMenuHolder" style={submenuColor}>
                          <span className="nav-text">Explorer</span>
                        </span>
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`${process.env.portalUrl}`}>
                        <span className="isoMenuHolder" style={submenuColor}>
                          <span className="nav-text">Portal</span>
                        </span>
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a href={`${process.env.exchangeUrl}`}>
                        <span className="isoMenuHolder" style={submenuColor}>
                          <span className="nav-text">Market</span>
                        </span>
                      </a>
                    </Menu.Item>
                  </Menu>
                </Scrollbars>
              </Col>
            </ContentHolder>
          </Row>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App,
    height: state.App.height
  }),
  {toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed}
)(Sidebar);
