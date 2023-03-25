import { Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { SpotifyClient } from "./spotify.client";
import { YouTubeClient } from "./youtube.client";

export default async function main() {
  const spotifyTrack = await SpotifyClient.currentTrack().catch();

  if (spotifyTrack) {
    const [video] = await YouTubeClient.searchVideos(spotifyTrack);
    await Clipboard.copy(`https://youtube.com/watch?v=${video.id}`);
    await showHUD(`Copied ${video.title} to clipboard`);
  } else {
    await showToast({
      style: Toast.Style.Failure,
      title: `Could not find Spotify Track`,
    });
  }
}
