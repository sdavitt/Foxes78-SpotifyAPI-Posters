/*
Spotify API Music Project

- set up my html and css to have a grid for my album covers and a little header!
- making my spotify api call - specific things im looking for:!
    - album cover img urls!
    - preview urls!
    - song name!
    - artist name!
- once data is loaded/transformed I need to place some of it in my html (specifically the album covers)!
- my real functionality: when you click on an album cover, it plays a song from that album!
    - MVP: clicking plays the song and I have a button to stop it - clicking an album cover can only play one specific song from that album!
    - futher functionality to explore:
        - clicking the album cover a second time can pause the music!
        - clicking the album cover plays a random song from the album* - I'll show another example with this done
        - now playing thingy?
*/

/*
Get access to the Spotify API - how do we do that? It uses OAuth 2.0.
We need to use our client ID and client Secret to get an API auth token
*/

// get an access token from the Spotify API
const getToken = async () => {
    const clientID = '';
    const clientSecret = '';

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const token = await result.json();
    console.log(token.access_token);
    return token.access_token
}



// search the API for a specific song
const searchAPI = async (song, artist, token) => {
    let data = await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${song}+artist:${artist}&limit=1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    data = await data.json();
    //console.log(data);
    return data
}

/*
- start with list of songs and artists
- make api call
- process data
- store
*/

// process the data from an API request
const processData = async (song, artist, token) => {
    let data = await searchAPI(song, artist, token);
    output = {
        'song': song,
        'artist': artist,
        'albumcover': data.tracks.items[0].album.images[0].url,
        'previewurl': data.tracks.items[0].preview_url
    };
    return output
}


// make the store the data function that handles all the api requests (move the bearer token function call here)
const initialLoading = async () => {
    let token = await getToken();
    // i'll need an array of all the song names and artist names
    let songs = [['Ocean', 'John Butler'], ['Sk8er Boi', 'Avril Lavigne'], ['Wenn du mich brauchst', 'Trettman'], ['American Boy', 'Estelle'], ['Roll the Bones', 'Shakey Graves'], ['From Eden', 'Hozier'], ['Location', 'Dave'], ['Motel', 'Ashkidd'], ['Water', 'Kojey Radical']];
    for (let i = 0; i < songs.length; i++) {
        songs[i] = await processData(songs[i][0], songs[i][1], token);
        // query select the right img tag -> change its href -> change its hidden property
        var img = document.getElementById(i.toString());
        img.src = songs[i].albumcover;
        img.hidden = false;
    }
    console.log(songs);
    music = songs;
}

initialLoading();

// global variables
let music;
let playing;
let stopbtn = document.getElementById('stopbtn');
let currently = document.getElementById('currently');

// click event to handle if albumcover is clicked - remember to add eventlisteners
let clickEvent = async (id) => {
    let clicked = music[id].previewurl;

    //1. Is there a previous song that was played?
    if (playing){
        //2. is the new click the same album cover that was previously clicked?
        if (clicked == playing.src) {
            // 3. is the song currently playing or is it paused?
            if (playing.paused){
                playing.play();
                stopbtn.innerHTML = 'Stop Music';
                stopbtn.disabled = false;
                currently.innerHTML = `Playing: ${music[id].song} - ${music[id].artist}`
                currently.hidden = false;
                console.log(`unpaused: ${id}`);
                return
            } else {
                stopSong();
                return
            }
        } else if (!playing.paused) {
            stopSong(); // if what was clicked is a different album cover and is currently playing, pause it
        }
    }
    // create audio from previewurl
    playing = new Audio(clicked);

    // play the audio
    console.log(playing);
    playing.play();
    stopbtn.innerHTML = 'Stop Music';
    stopbtn.disabled = false;
    currently.innerHTML = `Playing: ${music[id].song} - ${music[id].artist}`
    currently.hidden = false;
    console.log(`now playing: ${id}`);
}


// now that we have a global playing thing - let's make our stop button work
let stopSong = () => {
    playing.pause();
    console.log('stopped');
    stopbtn.innerHTML = 'Click an album cover to play a song.'
    stopbtn.disabled = true;
    currently.hidden = true;
}