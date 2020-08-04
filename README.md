# YouTube-Download-API

The YouTube Download API can be hosted on a server (running [Node](https://nodejs.org/en/))and used by any language that supports GET and POST requests, making this perfect for developing lightweight, yet powerful projects.

## Get Video

Video downloading is handled by [ytdl-core](https://www.npmjs.com/package/ytdl-core)

'{ServerURL}/GetVideo' takes in 2 parameters in the form of a JSON formatted string
* videoID (The ID of the YouTube video)
* (OPTIONAL) options (a JSON object of options for video downloading)

```json
{
    videoID: "m9f6VmXfVW4",
    options: null
}
```

This will return a JSON formatted string with the following properties...

* fileData (The file in the form of a byte array)
* videoInfo (Information about the YouTube video)

## Get Playlist Data

'{ServerURL}/PlaylistInfo' takes in a YouTube playlist ID as a parameter and returns a JSON formatted string of with data from all videos in the playlist.

Alternatively, you can use get playlist data from [YouTube Data API (v3)](https://developers.google.com/youtube/v3/) by passing in the following parameters in a JSON formatted string

* ID (The ID of the YouTube playlist)
* apiKey (Your Google API key)
* (OPTIONAL) maxResults (Maximum number of results per page, default 50)

```json
{
    ID: "PLs0o3PLRiVDHm97sLphobH0Y7bhannZmm",
    apiKey: someAPIKey
}
```

## Future Development

* Return a zip on '{ServerURL}/PlaylistInfo' in the form of a byte array
