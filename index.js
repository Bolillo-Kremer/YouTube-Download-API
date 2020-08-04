const express = require('express');
const http = require('http');
const cors = require('cors');
const ytdl = require('ytdl-core');
const toArray = require('stream-to-array');
const fetch = require('node-fetch');
const ytpl = require('ytpl');
const fs = require('fs');

const port = process.env.PORT || 5000;

//Builds Server
const app = express();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,

}
app.use(cors(corsOptions));
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

const server = http.createServer(app);

async function getVideoData(download) {
    fileInfo = {};

    try {
        fileInfo.videoInfo = await ytdl.getInfo(download.videoID, download.options);
        fileInfo.fileData = await toArray(ytdl(download.videoID, download.options));
    }
    catch (e) {
        fileInfo = e.toString();
    }

    return fileInfo;
}

function getPlaylistDataFromAPI(playlist) {
    return new Promise(async (resolve, reject) => {
        let playlistData = [];
        let maxResults = '50';
        let nextPage = '';
    
        if (playlist.hasOwnProperty('maxResults')) maxResults = playlist.maxResults.toString();
    
        function getUrl(pageToken) {
            return `https://www.googleapis.com/youtube/v3/playlistItems?pageToken=${pageToken}&part=snippet&maxResults=${maxResults}&playlistId=${playlist.ID}&key=${playlist.apiKey}`
        }
        
        try {
            while (true) {
                let settings = { method: "Get" };
                let res = await fetch(getUrl(nextPage), settings);
                let resData = await res.json();
            
                playlistData.push(resData);
        
                if (! resData.hasOwnProperty('nextPageToken')) {
                    resolve(playlistData);
                    break;
                } 
                else {
                    nextPage = resData.nextPageToken;
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

app.post('/GetVideo', (req, res) => {
    req.on('data', async (data) => {
        data = data.toString('ascii');
        console.log(data);
        if (data.isJSON()) {
            try {
                data = JSON.parse(data);
                let vidData = await getVideoData(data);
                res.send(JSON.stringify(vidData));
            }
            catch (e) {
                res.send(e.toString());
            }
        }
        else {
            res.send('Error: Content was not in JSON format and was expected to be');
        } 
    })
})

app.post('/PlaylistInfo', (req, res) => {
    req.on('data', async (data) => {
        data = data.toString('ascii');
        console.log(data);
        if (data.isJSON()){
            data = JSON.parse(data);
            let playlistData = await getPlaylistDataFromAPI();
            res.send(JSON.stringify(playlistData));
        }
        else {
            let playlistData = await ytpl(data)
            res.send(JSON.stringify(playlistData));
        }
    })
})

//Starts Server
server.on('error', (err) => {
    console.error('Server error:', err);
});
  
server.listen(port, () => {
    console.log(`app started at http://localhost:${port}`);
});

Object.defineProperty(String.prototype, "isJSON", {
    /**
     * Checks if a string is in JSON format
     */
    value: function isJSON() {
        return (/^[\],:{}\s]*$/.test(this.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
    },
    writable: true, 
    configurable: true
})