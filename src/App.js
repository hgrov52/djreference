import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "./helpers/config";
import hash from "./helpers/hash";
// import Player from "./Player";
import PlaylistTiles from "./components/PlaylistsTiles";
// import Navbar from "./Navbar";
// import logo from "./logo.svg";
import "./css/App.css";
import axios from "axios";
// import getCurrentlyPlaying from "./spotifyFunctions";

// const clientSecret = 'e2da1269c7664b16825c4991d882d521'



class App extends Component {
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
    // this.interval = setInterval(() => this.tick(), 1000);
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
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {!this.state.token && (
            <a
              className="btn btn--login App-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {/* {this.state.token && !this.state.no_data && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
              tick={this.tick}
              nextSong={this.nextSong}
            />
          )}
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )} */}
          {this.state.token && (
            // <Navbar />
            <div>
              <h1>
                Select Playlist
              </h1>
              <PlaylistTiles
                playlists={this.state.playlists}>

              </PlaylistTiles>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
