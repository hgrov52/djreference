import React from "react";


// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
// import SimpleFooter from "components/Footers/SimpleFooter.js";

import hash from "helpers/hash";
import { SpotifyLogin } from "./SpotifyLogin";

class CheckLoginPage extends React.Component {
    constructor() {
        super();
        this.state = {
            token: null,
            // item: {
            //     album: {
            //         images: [{ url: "" }]
            //     },
            //     name: "",
            //     artists: [{ name: "" }],
            //     duration_ms: 0
            // },
            // is_playing: "Paused",
            // progress_ms: 0,
            // no_data: false,
            // playlists: []
        };
        // this.getPlaylists = this.getPlaylists.bind(this)
        // this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
        // this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        if (this.refs.main) {
            this.refs.main.scrollTop = 0;
        }


        // Set token
        let _token = hash.access_token;


        if (_token) {
            // Set token
            this.setState({
                token: _token
            });
        }
    }
    render() {
        return (
            <>
                {!this.state.token && (
                    <SpotifyLogin />
                )}
                {this.state.token && (
                    <div>
                        {console.log('Token from CheckLoginPage', this.state.token)}
                        < DemoNavbar />
                        {React.cloneElement(this.props.children, { ...this.props, token: this.state.token })}
                        {/* < SimpleFooter /> */}
                    </div>
                )}
            </>
        );
    }
}

export default CheckLoginPage;
