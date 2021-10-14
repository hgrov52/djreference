import React from "react";
import "./Player.css";
import { MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
// import { IconButton } from '@mui/material';

const Player = props => {
  const backgroundStyles = {
    backgroundImage: `url(${props.item.album.images[0].url
      })`,
  };

  const progressBarStyles = {
    width: (props.progress_ms * 100 / props.item.duration_ms) + '%'
  };

  // const nextSong = () => {
  //   console.log('you clicked next song')
  // }

  const prevSong = () => {

    props.tick()
    if (props.progress_ms < 5000) {
      console.log('Previous Song')
    }
    else {
      console.log('Restart')
    }
  }


  return (
    <div className="App">
      <div className="background" style={backgroundStyles} />{" "}
      <div className="main-wrapper">
        <div className="btn-next-song" onClick={prevSong}>
          <MdSkipPrevious size={200} />
        </div>

        <div className="main-wrapper">
          <div className="now-playing__img">
            <img src={props.item.album.images[0].url} alt="None" />
          </div>
          <div className="now-playing__side">
            <div className="now-playing__name">{props.item.name}</div>
            <div className="now-playing__artist">
              {props.item.artists[0].name}
            </div>
            <div className="now-playing__status">
              {props.is_playing ? "Playing" : "Paused"}
            </div>
            <div className="progress">
              <div className="progress__bar" style={progressBarStyles} />
            </div>
          </div>

          <button className="btn-next-song" onClick={props.nextSong}>
            <MdSkipNext size={200} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Player;
