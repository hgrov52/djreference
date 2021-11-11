
import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
    Card,
    CardBody,
} from "reactstrap";


class PlaylistCard extends React.Component {


    handleSelect(e) {
        e.preventDefault()
        console.log(this.props.playlist)
    }
    render() {
        return (
            <>
                <Card className="card-lift--hover shadow border-0">
                    <CardBody className="py-5">

                        <img
                            src={this.props.imageUrl}
                            className="card-img"
                            alt="Album Art"
                        />
                        <h6 className="text-primary text-uppercase">
                            {this.props.playlist.name}
                        </h6>
                        <p className="description mt-3">
                            {this.props.playlist.tracks.total} Tracks
                        </p>
                        <Link className="btn btn-primary mt-4" to={{ pathname: '/song-download-page', query: { playlistId: this.props.playlist.id } }}>Download {this.props.playlist.name}</Link>
                    </CardBody>
                </Card>

            </>
        );
    }
}

export default PlaylistCard;
