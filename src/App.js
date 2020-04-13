import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import io from "socket.io-client";
import ReactGA from 'react-ga'

import './App.css';

import Home from './page/Home/Home.js';
import Game from './page/Game/Game';
import UsernamePrompt from './component/UsernamePrompt/UsernamePrompt';
import ConsentBanner from './component/ConsentBanner/ConsentBanner';
import AboutCookies from './page/AboutCookies/AboutCookies';

const trackingId = 'UA-163486392-1'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      roomId: null,
      game: null,
      users: null,
      host: null,
      consentAsked: false
    }
  }

  render() {
    const App = () => (
        <div className="App">
          <Switch>
            <Route exact path='/'>
              <Home onJoinParty={this.onJoinButtonClick} onCreateParty={this.onCreateButtonClick} />
            </Route>
            <Route exact path='/cookies-info'>
              <AboutCookies />
            </Route>
            <Route path='/*'>
              {
                this.state.roomId !== null &&
                <Game session={this.state} onHomeClick={this.onQuitLobby} socket={this.socket} />
              }
              
            </Route>
            {/* TODO error page */}
          </Switch>
          {this.state.createPrompt && <UsernamePrompt game={this.state.game} onClose={this.cancelPrompts} onStart={this.onCreateStartClick}/>}
          {this.state.joinPrompt && <UsernamePrompt game={this.state.game} onClose={this.cancelPrompts} onStart={this.onJoinStartClick}/>}
          {!this.state.consentAsked && this.props.location.pathname !== '/cookies-info' &&
          <ConsentBanner
            onReadMore={this.onReadMoreConsent}
            onRefuse={this.onRefuseConsent}
            onAccept={this.onAcceptConsent}
          />}
        </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
      
    );
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      if (action === 'POP') {
        if (location.pathname === '/' && typeof this.state.roomId !== 'undefined') {
          this.onQuitLobby()
        }
      }
    })
    this.initializeSocket()
  }

  componentWillUnmount() {
    this.socket.off('app.connected')
    this.socket.off('state.none')
    this.socket.off('state.lobby')
    this.socket.off('room.unavailable')
    this.socket.off('room.isAvailable')
  }

  // ################
  // # CONSENT FORM #
  // ################

  onReadMoreConsent = () => {
    this.props.history.push('/cookies-info')
    this.setState({
      userId: null,
      roomId: null,
      game: null,
      users: null,
      host: null,
      username: null,
      joinPrompt: false,
      createPrompt: false
    })
  }

  onRefuseConsent = () => {
    this.setState({
      consentAsked: true
    })
  }

  onAcceptConsent = () => {
    this.setState({
      consentAsked: true
    })
    ReactGA.initialize(trackingId)
    this.props.history.listen((location, _) => {
      if (location.pathname !== '/' && location.pathname !== '/cookies-info' && this.state.game !== null) {
        ReactGA.pageview(this.state.game.id)
      } else {
        ReactGA.pageview(location.pathname + location.search)
      }
    })
  }

  initializeSocket = () => {
    this.socket = io()
    this.socket.emit('app.connect')
    this.socket.on('app.connected', () => {
      this.socket.emit('state.get')

      this.socket.on('state.none', () => {
        // TODO if trying to access room
        const path = this.props.location.pathname
        if (path !== '/' && path !== '/cookies-info') {
          this.socket.emit('room.available', {roomId: path.substr(1)})
        } else {
          this.props.history.push('/')
          this.setState({
            userId: null,
            roomId: null,
            game: null,
            users: null,
            host: null,
            username: null
          })
        }
      })
  
      this.socket.on('state.lobby', (data) => {
        const state = {
          userId: data.userId,
          roomId: data.roomId,
          game: data.game,
          users: new Map(JSON.parse(data.users)),
          host: data.host,
          username: data.username
        }
        this.setState(state)
        this.props.history.push(`/${state.roomId}`)
      })

      this.socket.on('room.unavailable', (message) => {
        this.props.history.push('/')
        alert(message)
      })

      this.socket.on('room.isAvailable', (data) => {
        const state = {
          roomId: data.roomId,
          game: data.game,
          users: new Map(JSON.parse(data.users)),
          host: data.host
        }
        this.setState(state)
        this.props.history.push(`/${state.roomId}`)
        this.openJoinPrompt(this.state.game)
      })

      this.socket.on('room.hostDisconnected', (username) => {
        this.props.history.push('/')
        this.setState({
          userId: null,
          roomId: null,
          game: null,
          users: null,
          host: null,
          username: null
        })
        alert(`Host ${username} disconnected`)
      })

      this.socket.on('room.removed', (hostName) => {
        this.props.history.push('/')
        alert(`You were removed by "${hostName}"`)
      })

      this.socket.on('disconnect', () => {
        this.props.history.push('/')
        alert('Connection with server has been interrupted')
        window.location.reload(false)
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
    this.socket.emit('room.available', ({roomId: roomId}))
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
    this.socket.emit('room.join', data)
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
      roomId: null,
      username: null
    })
    // TODO proper alert
    alert(message)
  }

  // ### NAVIGATION ###

  onQuitLobby = () => {
    this.socket.emit('room.quit')
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
