import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import io from "socket.io-client";

import './App.css';

import Home from './page/Home';

class App extends Component {
  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
      
    );
  }

  componentDidMount() {
    var socket = io()
  }

}

export default App;
