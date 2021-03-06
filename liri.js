// require('dotenv').config();
var request = require("request");
var Twit=require('twit');
//var T = new Twit(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET); 
//var config= (process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET);
var config=require('./keys');
var action = process.argv[2];
var spotify = require('spotify');
var fs = require ('fs');
var songName = "";
var movieName = "";
var nodeArgs = process.argv;
var sortData = [];

//console.log (config);
switch (action) {
  case "my-tweets":
    twitter();
    break;

  case "movie-this":
    movieSearch();
    break;

  case "spotify-this-song":
// For-loop through all the words and to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {
      if (i > 3 && i < nodeArgs.length) {
      songName = songName + "+" + nodeArgs[i];
      }else {
      songName += nodeArgs[i];
      }
    }
//if no user input 
      if (songName === ""){
      songName = "0hrBpAOgrt8RXigk83LLNE";
    }
   	spot(songName);
    break;
  case "do-what-it-says":
   	doWhat();
    break;
}


// ----twitter function------
function twitter() {
	myWrite("----------");
	myWrite(action);
	//var T = new Twit(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET); 
	
  var T = new Twit(config)
  var params ={
	q:'%3Aamillena1',
	lang: 'en',
	count: 20
	};

	T.get('search/tweets', params, gotData);
	function gotData(err, data, response) {
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length; i++){
			console.log(tweets[i].text);
			myWrite(tweets[i].text);	
		}	
	};
};

//---- movie search function ----
function movieSearch(){
// For-loop through all the words and to handle the inclusion of "+"s
	for (var i = 3; i < nodeArgs.length; i++) {
	  if (i > 3 && i < nodeArgs.length) {
	    movieName = movieName + "+" + nodeArgs[i];
	  }
	  else {
	    movieName += nodeArgs[i];
	  }
	}
// The OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

request(queryUrl, function(error, response, body) {
 // If user has empty input 
  	if (movieName === "") {
  	console.log("If you have not watched 'Mr.Nobody'");
  	console.log("Then you should: http://www.imdb.com/title/tt04859471/");
  	console.log("Its on NetFlix!");
  	return;

 // Request is successful
  	}else if(!error && response.statusCode === 200) {
 // Display output 
    myWrite("----------");
   	myWrite(action);
    var title = "Title: " + JSON.parse(body).Title;
    console.log(title);
    myWrite(title);
   
    var year = "Year Released: " + JSON.parse(body).Year;
   	console.log(year);
   	myWrite(year);
   
    var imdb ="IMDB Rating: " + JSON.parse(body).imdbRating;
   	console.log(imdb);
   	myWrite(imdb);
   
    var prod = "Produced in: " + JSON.parse(body).Country;
  	console.log(prod);
  	myWrite(prod);
   
    var plot = "Plot: " + JSON.parse(body).Plot;
   	console.log(plot);
   	myWrite(plot);
    
    var actors = "Actors: " + JSON.parse(body).Actors;
   	console.log(actors);
   	myWrite(actors);
   
    var rotten = "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value;
   	console.log(rotten);
   	myWrite(rotten);
   
    var rurl = "Rotten Tomatoes URL: " + "https://www.rottentomatoes.com/";
 	  console.log(rurl);
 	  myWrite(rurl);
 	  }
  });
};


//----spotify function------
function spot(songName){

console.log("inside spotify function: "+songName);
  if (songName === "0hrBpAOgrt8RXigk83LLNE"){
    spotify.lookup({ type: 'track', id: '0hrBpAOgrt8RXigk83LLNE' }, 
    function(err, data) {
      if ( err ) {
        console.log('Error occurred: ' + err);
        return;
      } 
        myWrite("----------");
        myWrite(action);

        var song = "Song Name: " + data.name;     
        console.log(song); 
        myWrite(song);

        var artistName = "Artist Name: " + data.album.artists[0].name;
        console.log(artistName);
        myWrite(artistName);

        var previewURL = "Preview URL: " + data.preview_url;
        console.log(data.preview_url);  
        myWrite(previewURL);

        var albumName = "Album Name: " + data.album.name;
        console.log(albumName);
        myWrite(albumName);
        return;
    }); 

	}else{
    spotify.search({ type: 'track', query: '"'+songName+'"' }, 
		function(err, data) {
    	if ( err ) {
        console.log('Error occurred: ' + err);
        return;
      }
    // console.log(JSON.stringify(data, null, 4));   
    displaySpotify(data);
	 });
  }
}

//-----reading from random.text----------
function doWhat(){
    fs.readFile('random.txt','utf8',function(err,data){
// Clean up
    str1 = data.split('"').join(' ')
    str2 = str1.split(',').join(' ')
    str3 = str2.replace('spotify-this-song',' ');  
    sortData.push(str3);
	 var songName = sortData;
    spot(songName);
    });
}
// ---- Display spotify -----
function displaySpotify(data){
    console.log(data);
   	myWrite("----------");
   	myWrite(action);

    var artistName = "Artist Name: " + data.tracks.items[0].album.artists[0].name;
    console.log(artistName);
    myWrite(artistName);

    var song = "Song Name: " + data.tracks.items[0].name;
    console.log(song);
    myWrite(song);

    var previewURL = "Preview URL: " + data.tracks.items[0].preview_url;
    console.log(previewURL);
    myWrite(previewURL);

    var albumName = "Album Name: " + data.tracks.items[0].album.name;
	  console.log(albumName);
	  myWrite(albumName);
}


// ----writing to log.txt----
function myWrite(log){
	fs.appendFile('log.txt',log + "\r\n",function(err){
		if (err){
			return console.log(err);
		}
	});
}	

