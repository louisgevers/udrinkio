import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import io from "socket.io-client";

import './App.css';

import Home from './page/Home/Home.js';
import games from "./data/games.json"
import Game from './page/Game/Game';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      game: null,
      users: null,
      roomId: null,
      username: null
    }
  }

  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home ref={(home) => this.home = home} onPartyCreated={this.createParty} onJoinParty={this.attemptJoinParty} onPartyJoined={this.joinParty} />
            </Route>
            {/* TODO only 6 digit code paths, else error */}
            <Route path='/*'>
              <Game game={this.state.game} roomId={this.state.roomId} />
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
      this.setState({roomId: roomId})
      // TODO start lobby
      this.props.history.push(`/${roomId}`)
    })
    this.socket.on('invalid-room', () => {
      // TODO real alert
      alert('Invalid room number!')
    })
    this.socket.on('room-available', (gameId) => {
      this.setState({game: this.getGame(gameId)})
      this.home.onJoinParty(this.state.game)
    })
    this.socket.on('user-joined', (username) => {
      // TODO replace by adding user in lobby
      alert(username + ' joined the game!')
    })
  }

  createParty = (game, username) => {
    this.setState({
      game: game,
      username: username
    })
    this.socket.emit('create-party', {
      gameId: game.id,
      username: username
    })
  }

  joinParty = (username) => {
    this.setState({username: username})
    this.socket.emit('join-party', {
      roomId: this.state.roomId,
      username: username
    })
    this.props.history.push(`/${this.state.roomId}`)
  }

  attemptJoinParty = (roomId) => {
    this.setState({roomId: roomId})
    this.socket.emit('check-room', roomId)
  }

  getGame = (gameId) => {
    return games.filter((game) => game.id === gameId)[0];
  }

}

export default withRouter(App);
