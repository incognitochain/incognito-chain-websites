import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import Scrollbars from '@ui/utility/customScrollBar.js';
import Menu from '@ui/uielements/menu';
import IntlMessages from '@ui/utility/intlMessages';
import SidebarWrapper from './sidebar.style';
import appActions from '@/reducers/app/action';
import Logo from '@ui/utility/logo';
import themes from '@/settings/themes';
import { themeConfig } from '../../settings';
import { Row, Col } from 'antd';
import ContentHolder from '@ui/utility/contentHolder';
import imgLogo from '@/image/logo.png';
import { siteConfig } from '@/settings';
import Popover from '@ui/uielements/popover';

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;
const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const topMenus = [
  {
    key: '',
    label: 'sidebar.Exchange',
    leftIcon: '',
  },
  {
    key: 'wallet',
    label: 'sidebar.Wallet',
    leftIcon: '',
  },
  {
    key: 'portal',
    label: 'sidebar.Portal',
    leftIcon: '',
  },
  {
    key: 'voting',
    label: 'sidebar.Voting',
    leftIcon: '',
    children: [
      {
        label: 'sidebar.Voting',
        key: '1'
      },
      {
        label: 'sidebar.Voting',
        key: '2'
      },
      {
        label: 'sidebar.Voting',
        key: '3'
      }
    ]
  },
  {
    key: 'proposal',
    label: 'sidebar.Proposal',
    leftIcon: '',
  },
];

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVoting: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  goSubMenu = (i) => {

  }


  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
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
      sub3: ['sub2']
    };
    return map[key] || [];
  };

  listSubMenu(items){

    return(
      <div className="isoUserDropdown">
        {items.map(i => {
          return (
            <a className="lnkLanguage" href="#" key={i.key} onClick={() => this.goSubMenu(i) }>
              {i.label}
            </a>
          );
        })}
      </div>
    );
  }

  getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
    const { key, label, children } = singleOption;
    const url = stripTrailingSlash(this.props.url);

    if (1 == 2  && children) {

      return (

        <Popover
        content={this.listSubMenu(children)}
        trigger="click"
        visible={this.state.isVoting}
        onVisibleChange={() => this.setState({ isVoting: !this.state.isVoting })}
        arrowPointAtCenter={true}
        placement="bottomLeft"
      >
        <Menu.Item key={key}>
          <Link to={`/${key}`}>
            <span className="isoMenuHolder" style={submenuColor}>
              {/* <i className={leftIcon} /> */}
              <span className="nav-text">
                <IntlMessages id={label} />
              </span>
            </span>
          </Link>
        </Menu.Item>
      </Popover>
      );

      return (

        <SubMenu
          className="ulSubmenu"
          key={key}
          title={
            <span className="isoMenuHolder" style={submenuColor}>
              <span className="nav-text">
              <IntlMessages id={label} />
              </span>
            </span>
          }
        >
          {children.map(child => {console.log(child);
            const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `${url}/${child.key}`;
            return (
              <Menu.Item style={submenuStyle} key={child.key} >
                <Link style={submenuColor} to={`/${key}`}>
                  <IntlMessages id={child.label} />
                </Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    }

    return (
      <Menu.Item key={key}>
        <Link to={`/${key}`}>
          <span className="isoMenuHolder" style={submenuColor}>
            {/* <i className={leftIcon} /> */}
            <span className="nav-text">
              <IntlMessages id={label} />
            </span>
          </span>
        </Link>
      </Menu.Item>
    );
  };
  render() {
    const { app, toggleOpenDrawer } = this.props;
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'horizontal' : 'inline';
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
      backgroundColor: 'rgba(0,0,0,0.3)',
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
            <ContentHolder style={{ overflow: 'hidden', margin: 0 }}>
              <Col lg={4} md={4} sm={6} xs={4} >
              <Logo collapsed={collapsed} siteConfig={siteConfig} logo={imgLogo} />
              </Col>
              <Col lg={20} md={20} sm={18} xs={20} >
              <Scrollbars style={{ height: 50 }}>
                <Menu
                  onClick={this.handleClick}
                  theme="dark"
                  className="isoDashboardMenu"
                  mode={mode}
                  openKeys={collapsed ? [] : app.openKeys}
                  selectedKeys={app.current}
                  onOpenChange={this.onOpenChange}
                >
                  {topMenus.map(singleOption =>
                    this.getMenuItem({ submenuStyle, submenuColor, singleOption })
                  )}
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
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
