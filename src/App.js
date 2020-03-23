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
              <Home onPartyCreated={this.createParty} />
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
    this.socket = io()
    this.socket.on('assign-room', (roomId) => {
      this.roomId = roomId
      // TODO start lobby
      alert('Assigned to room ' + roomId + " for game " + this.game.name)
    })
  }

  createParty = (game, username) => {
    this.game = game
    this.username = username
    this.socket.emit('create-party', {
      gameId: game.id,
      username: username
    })
  }

}

export default App;
