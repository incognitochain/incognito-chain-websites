import React, {Component} from "react";
import Menu from "@ui/uielements/menu";
import {connect} from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class MainMenu extends Component {
  render() {
    return (
      <div style={{zIndex: 1000, position: 'fixed', top: '50px', width: '100%'}}>
        <Menu mode={"horizontal"}>
          <SubMenu
            title={<span><i className={"ion-android-apps"} style={{fontSize: '1.1rem', marginRight: '0.5rem'}}/>Bond Market</span>}>
            <Menu.Item>
              <a href="/bond-market">Buy Back Bond by GOV</a>
            </Menu.Item>
            <Menu.Item>
              <a href="/crowdsale">Bond Crowd Sale by DCB</a>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            title={<span><i className={"ion-android-apps"} style={{fontSize: '1.1rem', marginRight: '0.5rem'}}/>Token Trading</span>}>
            <Menu.Item>
              <a href="/market">Market</a>
            </Menu.Item>
            <Menu.Item>
              <a href="/exchange/CONST-GOV">Basic Trading</a>
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
