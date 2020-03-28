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
      userId: null,
      roomId: null,
      game: null,
      users: null,
      host: null
    }
  }

  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home onJoinParty={this.onJoinButtonClick} onCreateParty={this.onCreateButtonClick} />
            </Route>
            <Route path='/*'>
              {
                this.state.roomId !== null ?
                <Game game={this.state.game} roomId={this.state.roomId} users={this.state.users} isHost={this.state.isHost} userGameId={this.state.userGameId} onHomeClick={this.onQuitLobby} socket={this.socket} /> :
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

  componentDidMount = () => {
    this.props.history.listen((location, action) => {
      if (action === 'POP') {
        if (location.pathname === '/' && typeof this.state.roomId !== 'undefined') {
          this.onQuitLobby()
        }
      }
    })
    this.initializeSocket()
  }

  componentWillUnmount = () => {
    this.socket.off('app.connected')
    this.socket.off('state.none')
    this.socket.off('state.lobby')
  }

  initializeSocket = () => {
    this.socket = io()
    const uuid = localStorage.getItem('uuid')
    this.socket.emit('app.connect', uuid)
    this.socket.on('app.connected', (servUuid) => {
      
      if (servUuid !== uuid) {
        localStorage.setItem('uuid', servUuid)
      }

      this.socket.emit('state.get')

      this.socket.on('state.none', () => {
        this.props.history.push('/')
      })
  
      this.socket.on('state.lobby', (data) => {
        const state = {
          userId: data.userId,
          roomId: data.roomId,
          game: data.game,
          users: data.users,
          host: data.host
        }
        this.setState(state)
        this.props.history.push(`/${state.roomId}`)
      })

    })
  }

  // ################
  // #   HOMEPAGE   #
  // ################ 

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
    // TODO JOIN SOCKET
    // TODO LOADING SCREEN
  }


  // ### PROMPT start or leave

  onCreateStartClick = (username) => {
    const data = {
      username: username,
      game: this.state.game
    }
    this.closePrompts()
    this.socket.emit('room.create', data)
    // TODO LOADING SCREEN
  }

  onJoinStartClick = (username) => {
    const data = {
      username: username,
      roomId: this.state.roomId
    }
    this.closePrompts()
    // TODO EMIT SOCKET
    // TODO LOADING SCREEN
  }


  // #############
  // #   LOBBY   #
  // #############

  ejectGame = (message) => {
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

  // ### NAVIGATION ###

  onPathJoin = (path) => {
    // TODO socket join
    // this.socket.emit('room.availability', path.substr(1))
  }

  onQuitLobby = () => {
    // TODO socket join
    // this.socket.emit('room.quit')
    this.props.history.push('/')
    this.setState({
      game: null,
      users: null,
      roomId: null,
      username: null
    })
  }

}

export default withRouter(App);
