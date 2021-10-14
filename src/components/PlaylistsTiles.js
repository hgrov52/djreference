import React from "react";
// import { useState } from "react";
import "../css/PlaylistTiles.css";

// import { IconButton } from '@mui/material';

export function PlaylistTiles(props) {
    // const backgroundStyles = {
    //     backgroundImage: `url(${props.item.album.images[0].url
    //         })`,
    // };

    const clickPlaylist = (playlist) => {
        console.log(playlist);
    }

    // let { playlists, setPlaylists } = useState()

    return (
        <div>
            <h1>
                Select Playlist
            </h1>
            <div className="container">
                {props.playlists.map((playlist, i) => {
                    try {
                        return (
                            <div key={i} className="grid-item" onClick={() => { clickPlaylist(playlist) }}>
                                <div className="playlist-card">
                                    <img src={playlist.images[0].url} className="album-art" alt="Album Art" />
                                    <p>
                                        {playlist.name}
                                    </p>
                                    <p>
                                        {playlist.tracks.total} Tracks
                                    </p>
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
        </div>
    );
}

export default PlaylistTiles;