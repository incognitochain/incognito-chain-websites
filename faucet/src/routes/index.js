import React from 'react';

import {
  BrowserRouter as Router, Route, Link
} from "react-router-dom"

import Home from "./Home";

class Routes extends React.Component {
  render (){
    return (
      <Router>
          <Route exact path="/" component={Home} />
      </Router>
    )
  }
}

export default Routes
