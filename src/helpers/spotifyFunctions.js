import axios from "axios";

const getCurrentlyPlaying = (token) => {
    axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then((response) => {
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
    // .catch((error) => {
    //     console.error(error.text)
    // })
}

export default getCurrentlyPlaying;