import React from "react";
import hash from "../helpers/hash";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";

export function LoginPage() {
    return (
        <a
            className="btn btn--login App-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
            )}&response_type=token&show_dialog=true`}
        >
            Login to Spotify
        </a>
    );
}