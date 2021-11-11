
import React from "react";

import SongCard from "components/Cards/SongCard";
import "../../assets/css/custom.css"

// reactstrap components
import {
    Container,
} from "reactstrap";

import axios from "axios";

// core components\
import CheckLoginPage from "./CheckLoginPage";

class SongDownload extends CheckLoginPage {
    state = { songs: null }
    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        // this.refs.main.scrollTop = 0;
        // console.log('test params', this.props.location.query)
        this.getSongsFromPlaylist()
    }

    async getSongsFromPlaylist() {
        var _next_url = `https://api.spotify.com/v1/playlists/${this.props.location.query.playlistId}/tracks?limit=100&offset=0`
        // console.log('token from songdownload', this.props.token)
        // console.log('playlistId from songdownload', this.props.location.query.playlistId)
        // this.setState({
        //     songs: [{ 'title': 'track title 1', 'artists': ['artist1', 'artist2'] }]
        // })

        this.setState({
            songs: []
        })
        while (_next_url) {
            await axios.get(_next_url, {
                headers: {
                    "Authorization": "Bearer " + this.props.token,
                }
            })
                // eslint-disable-next-line
                .then((response) => {
                    console.log('response', response.data)
                    this.setState({
                        songs: this.state.songs.concat(response.data.items)
                    });
                    _next_url = response.data.next
                }).catch((error) => {
                    console.log(error.response.data.error.message)
                })
        }
        console.log('songs: ', this.state.songs)
    }

    render() {
        return (
            <>
                <main className="profile-page" ref="main">
                    <section className="section section-shaped section-lg">

                        {/* Circles background */}
                        <div className="shape shape-style-1 bg-gradient-default">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        <Container className="py-lg-md d-flex">
                            <div className="col px-0">
                                <h1 className="display-3 text-white">
                                    Song Download
                                </h1>
                                <p className="lead text-white">
                                    Choose the song download source.
                                </p>
                            </div>
                        </Container>
                        {this.state.songs && this.state.songs.length > 0 && (

                            <div className="container">
                                {this.state.songs.map((song, i) => {
                                    // console.log('finding image:', this.state.songs[i].track.album.images[0].url)
                                    try {
                                        return (
                                            <div key={i} >
                                                <div className="song-item">
                                                    <SongCard song={this.state.songs[i]} imageUrl={this.state.songs[i].track.album.images[0].url} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    catch {
                                        console.log("CATCH", song)
                                        return (<div key={i} />)
                                    }
                                })}
                            </div>
                        )}

                    </section>
                </main>
            </>
        );
    }
}

export default SongDownload;
