import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import io from "socket.io-client";

import './App.css';

import Home from './page/Home';

class App extends Component {

  render() {
    return (
      <Switch>
        <div className="App">
          <Switch>
            <Route exact path='/' component={Home}/>
          </Switch>
        </div>
      </Switch>
      
    );
  }

  componentDidMount() {
    const { endpoint } = this.state
    var socket = io()
  }

}

export default App;
