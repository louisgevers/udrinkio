import React, { Component } from 'react';
import './App.css';

import Cover from './Cover/Cover.js'
import GamesPanel from './GamesPanel/GamesPanel.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Cover/>
        <GamesPanel />
      </div>
    );
  }
}

export default App;
