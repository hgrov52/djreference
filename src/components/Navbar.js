import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";


class Navbar extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <ul className="nav">
                        <li>
                            <Link to="/playlist-select">Playlists</Link>
                        </li>
                        <li>
                            <Link to="/player">Player</Link>
                        </li>
                    </ul>
                </Router>
            </div>
        );
    }
}

export default Navbar;