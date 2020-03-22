import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
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
}

export default App;
