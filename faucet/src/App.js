import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core'
import {faDatabase, faNetworkWired, faCubes, faRss, faHeartbeat} from '@fortawesome/free-solid-svg-icons'
import Routes from "./routes"

library.add(faDatabase)
library.add(faNetworkWired)
library.add(faHeartbeat)
library.add(faCubes)
library.add(faRss)

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes/>
      </div>
    );
  }
}

export default App;
