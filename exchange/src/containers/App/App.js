import React from "react";
import { connect } from "react-redux";
import { Layout, LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";
import { ThemeProvider } from "styled-components";
import Topbar from "../Topbar/Topbar";
import AppRouter from "./AppRouter";
import { siteConfig } from "../../settings";
import themes from "@/settings/themes";
import { themeConfig } from "../../settings";
import AppHolder from "./commonStyle";
import { AppLocale } from "../../dashApp";
import "./global.css";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import authActions from "../../redux/auth/actions";
import axios from "axios";
import auth from "@ui/auth";
import ContainerDimensions from "react-container-dimensions";

const { Content, Footer } = Layout;
const customizedTheme = themes[themeConfig.theme];

export function App(props) {
  const { url } = props.match;
  const { locale } = props;
  const currentAppLocale = AppLocale[locale];

  React.useEffect(() => {
    onAppStart();
  }, []);

  function onAppStart() {
    props.dispatch(authActions.checkAuthorization());
    setUpAxios();
  }

  function setUpAxios() {
    axios.defaults.headers.common["Content-Type"] =
      "application/json;charset=UTF-8";
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + auth.isLogged();
  }

  return (
    <LocaleProvider locale={currentAppLocale.antd}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <ThemeProvider theme={themes[themeConfig.theme]}>
          <AppHolder>
            <Layout style={{ height: window.height }}>
              <Topbar url={url} />

              <Layout style={{ flexDirection: "row", overflowX: "hidden" }}>
                <Layout
                  className="isoContentMainLayout"
                  style={{ height: window.height }}
                >
                  <Content
                    className="isomorphicContent"
                    style={{ ...customizedTheme.content }}
                  >
                    <AppRouter url={url} />
                  </Content>
                  <Footer style={{ ...customizedTheme.footer }}>
                    {siteConfig.footerText}
                  </Footer>
                </Layout>
              </Layout>
            </Layout>
          </AppHolder>
        </ThemeProvider>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default compose(
  withRouter,
  connect(state => ({
    auth: state.Auth,
    locale: state.LanguageSwitcher.language.locale,
    selectedTheme: state.ThemeSwitcher.changeThemes.themeName,
    height: state.App.height
  }))
)(App);
