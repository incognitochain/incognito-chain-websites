import React from "react";
import { Provider } from "react-redux";
import store from "store";
import Root from "components/App/Root";

import "antd/dist/antd.css";
import "styles/main.scss";

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
