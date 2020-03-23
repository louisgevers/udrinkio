import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import io from "socket.io-client";

import './App.css';

import Home from './page/Home';
import games from "./data/games.json"

class App extends Component {

  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home ref={(home) => this.home = home} onPartyCreated={this.createParty} onJoinParty={this.attemptJoinParty} onPartyJoined={this.joinParty} />
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
    this.socket.on('invalid-room', () => {
      // TODO real alert
      alert('Invalid room number!')
    })
    this.socket.on('room-available', (gameId) => {
      this.game = this.getGame(gameId)
      this.home.onJoinParty(this.game)
    })
    this.socket.on('user-joined', (username) => {
      // TODO replace by adding user in lobby
      alert(username + ' joined the game!')
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

  joinParty = (username) => {
    this.username = username
    this.socket.emit('join-party', {
      roomId: this.roomId,
      username: username
    })
  }

  attemptJoinParty = (roomId) => {
    this.roomId = roomId
    this.socket.emit('check-room', roomId)
  }

  getGame = (gameId) => {
    return games.filter((game) => game.id === gameId)[0];
  }

}

export default App;
