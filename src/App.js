// Default
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";


// CSS
import './css/index.css';
import './css/App.css';

// Components
import PlaylistTiles from './components/PlaylistsTiles';
import { LoginPage } from './components/LoginPage';
import Player from './components/Player';
import Navbar from './components/Navbar';

// Helpers
import hash from './helpers/hash.js'
// import * as serviceWorker from './helpers/serviceWorker';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
      playlists: []
    };
    this.getPlaylists = this.getPlaylists.bind(this)
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.tick = this.tick.bind(this);
  }



  componentDidMount() {

    // Set token
    let _token = hash.access_token;


    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
      this.getPlaylists(_token)
    }

    // set interval for polling every 1 seconds
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if (this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }

  // refreshToken() {
  //   axios.get('https://accounts.spotify.com/api/token', {
  //     headers: {
  //       'grant_type': 'client_credentials',
  //       'client_id': clientId,
  //       'client_secret': clientSecret,
  //     }
  //   }).then((response) => {
  //     console.log(response)
  //   }).catch((error) => {
  //     console.log('failed')
  //   })
  // }



  getCurrentlyPlaying(token) {
    axios.get("https://api.spotify.com/v1/me/player", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then((response) => {
        const data = response.data
        console.log(data)
        if (!data) {
          this.setState({
            no_data: true,
          });
          return
        }
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
          no_data: false,
        });
      })
  }

  // performApiCall(type, url, token, thenFunc) {
  //   axios({
  //     mthod: type,
  //     url: url,
  //     headers: {
  //       "Authorization": "Bearer " + token
  //     }
  //   })
  //     .then((response) => thenFunc)
  //     .catch((error) => {
  //       console.log(error.response.data.error.message)
  //     })
  // }


  async getPlaylists(token) {
    console.log('here')
    var _next_url = "https://api.spotify.com/v1/me/playlists?limit=50"
    this.setState({
      playlists: []
    })
    // let promises = []
    while (_next_url) {
      // promises.push(
      await axios.get(_next_url, {
        headers: {
          "Authorization": "Bearer " + token
        }
      })
        // eslint-disable-next-line
        .then((response) => {
          console.log('response', response.data)
          this.setState({
            playlists: this.state.playlists.concat(response.data.items)
          });
          _next_url = response.data.next
        }).catch((error) => {
          console.log(error.response.data.error.message)
        })
      // )
    }
    console.log('playlists: ', this.state.playlists)
    console.log('playlist[0] album art', this.state.playlists[0].images[0].url)
    // Promise.all(promises)
  }



  // nextSong(token) {
  //   axios.post("https://api.spotify.com/v1/me/player/next", {
  //     headers: {
  //       "Authorization": "Bearer " + token
  //     }
  //   })
  //   // .then(() => {
  //   //   this.tick()
  //   // })
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token && (
            <LoginPage />
          )}
          {this.state.token && (
            <div>




              <div>
                <Router>
                  <Navbar />
                  <Switch>
                    <Route path="/playlist-select" exact render={withRouter(() => <PlaylistTiles playlists={this.state.playlists} />)} />
                    <Route path="/player" exact render=
                      {withRouter(() => <Player
                        item={this.state.item}
                        is_playing={this.state.is_playing}
                        progress_ms={this.state.progress_ms}
                        tick={this.tick}
                      />)}
                    />
                    <Route path="/song-download/:song" />
                  </Switch>
                </Router>

              </div>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
