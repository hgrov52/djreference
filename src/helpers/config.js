export const authEndpoint = "https://accounts.spotify.com/authorize";

// Replace with your app's client ID, redirect URI and desired scopes
export const clientId = "ca1b674cf18b42918494dc988fb4e670";
export const redirectUri = "http://localhost:3000/playlist-select";
export const scopes = [
    // "user-top-read",
    // "user-read-currently-playing",
    // "user-read-playback-state",
    "playlist-read-private",
    // "playlist-read-public",
    "playlist-read-collaborative"
    // "user-modify-playback-state"
];
