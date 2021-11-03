
import React from "react";

// reactstrap components
import {
    Button,
    Badge,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from "reactstrap";

import axios from "axios";

// core components\
import CheckLoginPage from "./CheckLoginPage";
import PlaylistCard from "components/Cards/PlaylistCard";
import "../../assets/css/playlistList.css"

class Playlists extends CheckLoginPage {
    state = { playlists: null }
    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        // this.refs.main.scrollTop = 0;
        console.log(this.props.token)
    }

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
                                <Row>
                                    <Col lg="6">
                                        <h1 className="display-3 text-white">
                                            Select A Playlist
                                            {/* <span>The selected playlist will be downloaded through youtube</span> */}
                                        </h1>
                                        <p className="lead text-white">
                                            The selected playlist will be downloaded from youtube one by one, allowing you to selected the relevant youtube video
                                        </p>
                                        {(!this.state.playlists && (
                                            <div className="btn-wrapper">
                                                <Button
                                                    className="btn-white btn-icon mb-3 mb-sm-0 ml-1"
                                                    color="default"
                                                    onClick={() => this.getPlaylists(this.props.token)}
                                                >
                                                    <span className="btn-inner--icon mr-1">
                                                        <i className="fa fa-opera" />
                                                    </span>
                                                    <span className="btn-inner--text">
                                                        Get Playlists
                                                    </span>
                                                </Button>
                                            </div>
                                        ))}

                                    </Col>
                                </Row>
                            </div>
                        </Container>
                        {this.state.playlists && this.state.playlists.length > 0 && (

                            <div className="container">
                                {this.state.playlists.map((playlist, i) => {
                                    try {
                                        return (
                                            <div>
                                                <div key={i} className="grid-item" >
                                                    <PlaylistCard playlist={this.state.playlists[i]} imageUrl={this.state.playlists[i].images[0].url} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    catch {
                                        console.log("CATCH", playlist)
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

export default Playlists;
