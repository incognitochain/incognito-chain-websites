import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import Scrollbars from '@ui/utility/customScrollBar.js';
import Menu from '@ui/uielements/menu';
import { Dropdown, Icon } from 'antd';

import IntlMessages from '@ui/utility/intlMessages';
import SidebarWrapper from './sidebar.style';
import appActions from '../../redux/app/actions';
import Logo from '@ui/utility/logo';
import themes from '@/settings/themes';
import { themeConfig } from '../../settings';
import { Row, Col } from 'antd';
import ContentHolder from '@ui/utility/contentHolder';
import imgLogo from '@/image/logo.png';
import { siteConfig } from '@/settings';
import Popover from '@ui/uielements/popover';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed
} = appActions;
const stripTrailingSlash = (str) => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const subMenuVoting = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
    </Menu.Item>
  </Menu>
);

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
    key: 'voting',
    label: 'sidebar.Voting',
    leftIcon: '',
    children: [
      {
        label: 'sidebar.VotingBoard',
        key: 'voting'
      },
      {
        key: 'proposal',
        label: 'sidebar.Proposal',
        leftIcon: '',
      },
    ]
  },
  {
    key: 'bond-market',
    label: 'sidebar.BondMarket',
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

  getSubMenuItem(child, submenuColor){
    const url = stripTrailingSlash(this.props.url);
    const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `/${child.key}`;
    return (
      <Menu.Item key={child.key}>
        <Link style={submenuColor} to={linkTo}>
          <IntlMessages id={child.label} />
        </Link>
      </Menu.Item>
    );
  }

  getSubMenu = (children) => {

    return (
      <Menu>
        {children.map((item)=> this.getSubMenuItem(item))}
      </Menu>
    );

  }
  renderMainMenuText({submenuColor, label}) {
    return (
      <span className="isoMenuHolder" style={submenuColor}>
      <span className="nav-text">
        <IntlMessages id={label} />
      </span>
      </span>
    );
  }

  renderDropdownMainMenuText({submenuStyle, submenuColor, children, label, url}) {

    return (
      <Dropdown overlay={this.getSubMenu(children, submenuColor)}>
        <span className="ant-dropdown-link" href="#">
          <IntlMessages id={label} />
          <Icon type="down" />
        </span>
      </Dropdown>
    );
  }

  getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
    const { key, label, children } = singleOption;

    return (
      <Menu.Item key={key}>
        <Link to={`/${key}`}>
          {children ? this.renderDropdownMainMenuText({submenuStyle, submenuColor, children, label})
            :
            this.renderMainMenuText({submenuColor, label})}
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
