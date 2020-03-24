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
    this.initializeSocketIO()
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
              <Home onJoinParty={this.onJoinButtonClick} onCreateParty={this.onCreateButtonClick} />
            </Route>
            <Route path='*'>
              {
                this.state.roomId !== null ?
                <Game game={this.state.game} roomId={this.state.roomId} users={this.state.users} isHost={this.state.isHost} /> :
                () => this.onPathJoin(this.props.location.pathname)
              }
              
            </Route>
            {/* TODO error page */}
          </Switch>
          {this.state.createPrompt && <UsernamePrompt game={this.state.game} onClose={this.cancelPrompts} onStart={this.onCreateStartClick}/>}
          {this.state.joinPrompt && <UsernamePrompt game={this.state.game} onClose={this.cancelPrompts} onStart={this.onJoinStartClick}/>}
        </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
      
    );
  }

  initializeSocketIO() {
    this.socket = io()

    this.socket.on('room.created', (data) => {
      this.setState({
        users: data.users,
        isHost: data.isHost,
        roomId: data.roomId
      })
      this.props.history.push(`/${data.roomId}`)
    })

    this.socket.on('room.unavailable', (message) => {
      this.props.history.push('/')
      // TODO proper pop up
      alert(message)
    })

    this.socket.on('room.available', (data) => {
      this.setState({
        game: data.game,
        isHost: data.isHost,
        users: data.users,
        roomId: data.roomId
      })
      this.openJoinPrompt(this.state.game)
    })

    this.socket.on('room.joined', (data) => {
      this.setState({
        game: data.game,
        isHost: data.isHost,
        users: data.users,
        roomId: data.roomId
      })
      this.props.history.push(`/${data.roomId}`)
    })

    this.socket.on('room.newUser', (users) => {
      this.setState({
        users: users
      })
    })

    this.socket.on('room.hostDisconnected', (username) => {
      this.leaveGame(`Host "${username}" has disconnected`)
    })

    this.socket.on('room.userDisconnected', (users) => {
      this.setState({
        users: users
      })
    })
  }

  leaveGame = (message) => {
    this.props.history.push('/')
    this.setState({
      game: null,
      isHost: false,
      users: null,
      roomId: null
    })
    // TODO proper alert
    alert(message)
  }

  // ### OPEN and CLOSE PROMPTS ###

  // Open the create prompt
  openCreatePrompt = (game) => {
    this.setState({
      createPrompt: true, 
      game: game
    })
  }

  // Open the join prompt
  openJoinPrompt = (game) => {
    this.setState({
      joinPrompt: true,
      game: game
    })
  }

  // Close prompts (e.g. after starting the game)
  closePrompts = () => {
    this.setState({
      createPrompt: false,
      joinPrompt: false
    })
  }

  // Close prompts and go back to homepage, reset game
  cancelPrompts = () => {
    this.props.history.push('/')
    this.setState({
      createPrompt: false,
      joinPrompt: false,
      game: null
    })
  }

  // ### JOIN and CREATE button clicks ###

  onCreateButtonClick = (game) => {
    this.openCreatePrompt(game)
  }

  onJoinButtonClick = (roomId) => {
    this.socket.emit('room.availability', roomId)
    // TODO LOADING SCREEN
  }


  // ### PROMPT start or leave

  onCreateStartClick = (username) => {
    const data = {
      username: username,
      game: this.state.game
    }
    this.socket.emit('room.create', data)
    this.closePrompts()
    // TODO LOADING SCREEN
  }

  onJoinStartClick = (username) => {
    const data = {
      username: username,
      roomId: this.state.roomId
    }
    this.socket.emit('room.join', data)
    this.closePrompts()
    // TODO LOADING SCREEN
  }

  // ### URL MAPPING ###
  onPathJoin = (path) => {
    this.socket.emit('room.availability', path.substr(1))
  }

  getGame = (gameId) => {
    return games.filter((game) => game.id === gameId)[0];
  }

}

export default withRouter(App);
