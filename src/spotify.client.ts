import { showToast, Toast } from "@raycast/api";
import { runAppleScript } from "run-applescript";

export class SpotifyClient {
  public static currentTrack = async (): Promise<string | undefined> => {
    const script = `
      if application "Spotify" is not running then
          return "Not playing"
      end if
    
      property currentTrackName : "Unknown Track"
      property currentTrackArtist : "Unknown Artist"
      property playerState : "stopped"
    
      tell application "Spotify"
          try
              set currentTrackName to name of the current track
              set currentTrackArtist to artist of the current track
              set playerState to player state as string
          end try
      end tell
    
      if playerState is "playing" then
          return currentTrackName & " by " & currentTrackArtist
      else if playerState is "paused" then
          return currentTrackName & " by " & currentTrackArtist
      else
          return "Not playing"
      end if`;

    const result = await runAppleScript(script);
    if (result === "Not playing") {
      return undefined;
    }
    return result;
  };
}
