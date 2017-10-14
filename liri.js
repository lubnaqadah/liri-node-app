var keys = require('./keys.js');
var request = require('request');
var Spotify = require('node-spotify-api');
var twitter = require('twitter');
var fs = require('fs');

var command = process.argv[2];
var name = "";
//the forr loop to handle the spaces in the name
for (var i= 3; i < process.argv.length ;i++){
	name += process.argv[i] + "+";
};


if (command == 'my-tweets'){
	twitterBot()
}else if(command == 'spotify-this-song'){
	spotifyBot()

}else if(command == 'movie-this'){
	omdbBot()

}else if(command == 'do-what-it-says'){
	fs.readFile('./random.txt', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		modData = data.split(",");
		command = modData[0];
		name = modData[1];
		spotifyBot();

	});

};

//the function to get data from twitter API

function twitterBot(){
	var client = new twitter(keys.twitterKeys);
	var params = {
		count:20
	}

	client.get('statuses/user_timeline', params, function(err, data){
		if (err){console.log(err)}
		else{
			for (var i in data){
				var info = data[i].text + '   Created on: '+data[0].created_at;
				console.log('-------------------');
				console.log(info);
				console.log('-------------------');

//	appending the information to the logs.txt file

				fs.appendFile('logs.txt', command + name + '\n' + info + '\n-------------------\n', function (err) {
					if (err) throw err;
					console.log('Saved!');
				});
			}}
	} );
};


//the function to get data from spotify API

function spotifyBot(){
	var spotify = new Spotify({
		id:'5f5d3442d527438d8ca869082e4c550e',
		secret:'28a589034a864798af05eb0f2f8639c7'
	});
	if (name == ""){
		name = 'The Sign '
	};

	spotify.search({ type: 'track', query: name , limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		//			creating song Object that contains all the information about the searched song

		var song = new Object();
		song.artist = data.tracks.items[0].album.artists[0].name;
		song.title = data.tracks.items[0].name;
		song.link = data.tracks.items[0].external_urls.spotify;
		song.album = data.tracks.items[0].album.name;

		console.log('-------------------');

		console.log(song);
		console.log('-------------------');

//	appending the information to the logs.txt file
		fs.appendFile('logs.txt', command + name + '\n' + JSON.stringify(song) + '\n-------------------\n', function (err) {
			if (err) throw err;
			console.log('Saved!');
		});
	});

};


//the function to get data from omdb API
function omdbBot(){

	if (name == ""){
		name = 'Mr. Nobody'
	};
	var url = 'http://www.omdbapi.com/?t=' + name + '&plot=short&apikey=40e9cece';

	request(url, function(err, respond, body){

		if (err){
			console.log(err);
		}else{
			//			creating movie Object that contains all the information about the searched movie
			var movie = new Object();
			movie.title = JSON.parse(body).Title;
			movie.released_on = JSON.parse(body).Released;
			movie.Rotten_tomatoes_rating = JSON.parse(body).Ratings[1].Value;
			movie.IMDB_rating = JSON.parse(body).imdbRating;
			movie.language = JSON.parse(body).Language;
			movie.country = JSON.parse(body).Country;
			movie.plot = JSON.parse(body).Plot;
			movie.actors = JSON.parse(body).Actors;
			console.log('-------------------');
			console.log(movie);
			console.log('-------------------');

//		appending the information to the logs.txt file

			fs.appendFile('logs.txt', command + name + '\n' + JSON.stringify(movie) + '\n-------------------\n', function (err) {
				if (err) throw err;
				console.log('Saved!');
			});

		}

	})
}






