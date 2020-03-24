import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import io from "socket.io-client";

import './App.css';

import Home from './page/Home/Home.js';
import games from "./data/games.json"
import Game from './page/Game/Game';
import UsernamePrompt from './component/UsernamePrompt/UsernamePrompt';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      game: null,
      users: null,
      roomId: null,
      username: null,
      createPrompt: false,
      joinPrompt: false
    }
  }

  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home onJoinParty={this.attemptJoinParty} onCreateParty={this.onCreateParty} />
            </Route>
            {/* TODO only 6 digit code paths, else error */}
            <Route path='/*'>
              <Game game={this.state.game} roomId={this.state.roomId} />
            </Route>
          </Switch>
          {this.state.createPrompt && <UsernamePrompt game={this.state.game} onClose={this.onPromptClose} onStart={(username) => this.createParty(this.state.game, username)}/>}
          {this.state.joinPrompt && <UsernamePrompt game={this.state.game} onClose={this.onPromptClose} onStart={this.joinParty}/>}
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
      this.setState({roomId: roomId, createPrompt: false,
        joinPrompt: false})
      // TODO start lobby
      this.props.history.push(`/${roomId}`)
    })
    this.socket.on('invalid-room', () => {
      // TODO real alert
      alert('Invalid room number!')
    })
    this.socket.on('room-available', (gameId) => {
      this.setState({game: this.getGame(gameId)})
      this.onJoinParty(this.state.game)
    })
    this.socket.on('user-joined', (username) => {
      // TODO replace by adding user in lobby
      alert(username + ' joined the game!')
    })
  }

  // ### PROMPT TOGGLING ###

  // Open the prompt to create a party
  onCreateParty = (game) => {
    this.setState({
      createPrompt: true,
      game: game
    })
  }

  // Open the prompt to join a party
  onJoinParty = (game) => {
    this.setState({
      joinPrompt: true,
      game: game
    })
  }

  // Close prompt and return to homepage
  onPromptClose = () => {
    this.props.history.push('/')
    this.setState({
      createPrompt: false,
      joinPrompt: false,
      game: null
    })
  }


  // ### SOCKET.IO JOIN AND CREATE PARTIES ###

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
      username: username,
      createPrompt: false,
      joinPrompt: false
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
