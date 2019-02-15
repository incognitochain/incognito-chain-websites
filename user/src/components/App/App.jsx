import React from "react";
import { Provider } from "react-redux";
import store from "store";
import Root from "components/App/Root";
import "styles/main.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default App;
