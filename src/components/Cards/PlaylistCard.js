
import React from "react";

// reactstrap components
import {
    Button,
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
                            className="icon icon-shape-primary rounded-circle mb-1"
                            alt="Album Art"
                        />
                        <h6 className="text-primary text-uppercase">
                            {this.props.playlist.name}
                        </h6>
                        <p className="description mt-3">
                            {this.props.playlist.tracks.total} Tracks
                        </p>
                        <Button
                            className="mt-4"
                            color="primary"
                            href="#pablo"
                            onClick={e => this.handleSelect(e)}
                        >
                            Download {this.props.playlist.name}
                        </Button>
                    </CardBody>
                </Card>

            </>
        );
    }
}

export default PlaylistCard;
