
import axios from "axios";
import React from "react";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
} from "reactstrap";


class SongCard extends React.Component {

    state = { artistString: null }

    componentDidMount() {
        this.artistString()
        this.searchMP3Juices()
    }

    handleSelect(e) {
        e.preventDefault()
        console.log(this.props.song)
    }

    artistString() {
        let artists = []
        this.props.song.track.artists.map((artist) => (
            artists.push(artist.name)
        ))
        this.setState({ artistString: artists.join(', ') })
    }

    async searchMP3Juices() {
        let searchCriteria = []
        this.props.song.track.artists.map((artist) => (
            searchCriteria = searchCriteria.concat(artist.name.split(' '))
        ))
        searchCriteria.push(this.props.song.track.name)
        searchCriteria.push('extended')

        /*

            body: raw: {"context":{"client":{"clientName":"WEB_REMIX","clientVersion":"1.20211027.00.00"}},"query":"acraze do it do it"}


        */

        var data = '{"context":{"client":{"clientName":"WEB_REMIX","clientVersion":"1.20211027.00.00"}},"query":"acraze do it do it"}';

        var config = {
            method: 'post',
            url: 'https://music.youtube.com/youtubei/v1/search?key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
            headers: {
                'Origin': 'https://music.youtube.com',
                'x-origin': 'https://music.youtube.com',
                'referer': 'https://music.youtube.com/'
            },
            proxy: {
                host: '130.44.178.97',
                port: 3128
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });



        // searchCriteria = searchCriteria.join('%20')

        // let url = `https://mp3-juice.com/api.php?q=${searchCriteria}`
        // // console.log(searchCritesria)

        // this.setState({
        //     mp3JuicesObject: []
        // })
        // await axios.get(url, {
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "crossdomain": true
        //     }
        // })
        //     .then((response) => {
        //         console.log('response', response.data)
        //         // this.setState({
        //         //     songs: this.state.songs.concat(response.data.items)
        //         // });
        //     }).catch((error) => {
        //         console.log(error.response.data.error.message)
        //     })
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
                            {this.props.song.track.name}
                        </h6>
                        <p className="description mt-3">
                            {this.state.artistString}
                        </p>
                        <Button
                            className="mt-4"
                            color="primary"
                            href="#pablo"
                            onClick={e => this.handleSelect(e)}
                        >
                            Download
                        </Button>
                    </CardBody>
                </Card>

            </>
        );
    }
}

export default SongCard;
