import React, {Component} from "react";
import Menu from "@ui/uielements/menu";
import {connect} from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MainMenu extends Component {
  render() {
    return (
      <div style={{zIndex: 10000, position: 'fixed', top: '50px', width: '100%'}}>
        <Menu mode={"horizontal"}>
          <SubMenu title={"Exchange"}>
            <Menu.Item>
              <a href="/exchange/CONSTANT-GOVTOKEN">Basic</a>
            </Menu.Item>
          </SubMenu>
          <SubMenu title={"Bond Market"}>
            <Menu.Item>
              <a href="/bond-market">Buy Back Bond by GOV</a>
            </Menu.Item>
            <Menu.Item>
              <a href="/crowdsale">Bond Crowd Sale by DCB</a>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme
  }),
  {}
)(MainMenu);
