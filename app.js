const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const readline = require('readline-sync');
const axios = require('axios');

const server = http.createServer(function (request, response) {
	console.log('request starting...');

	let filePath = './public';
	let contentType = 'text/html';

	if (request.url.endsWith('.css')) {
		filePath += request.url;
		contentType = 'text/css';
	} else if (request.url.endsWith('.js')) {
		filePath += request.url;
		contentType = 'text/javascript';
	} else {
		filePath += '/index.html';
	}

	fs.readFile(filePath, function (error, content) {
		if (error) {
			response.writeHead(500);
			response.end();
		} else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
});

server.listen(3000);
console.log('Server running at http://localhost:3000/');

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

var auth = Buffer.from(client_id + ':' + client_secret).toString('base64');

var config = {
	headers: {
		Authorization: 'Basic ' + auth,
	},
};

function logNBAGamesInCity() {
	var city = readline.question('Enter the city name (or exit to quit): ');

	if (city === 'exit') {
		console.log('Goodbye!');
		return;
	}

	axios
		.get(
			'https://api.seatgeek.com/2/events?taxonomies.name=nba&venue.city=' +
				city,
			config
		)
		.then(function (response) {
			console.log('NBA games in ' + city + ':');
			var events = response.data.events;
			events.forEach(function (event) {
				var date = new Date(event.datetime_local);
				console.log(
					'- ' +
						event.title +
						' at ' +
						event.venue.name +
						' on ' +
						date.toLocaleDateString() +
						'\nLink to purchase tickets: ' +
						event.url
				);
			});

			logNBAGamesInCity();
		})
		.catch(function (error) {
			console.error(error);
			logNBAGamesInCity();
		});
}

logNBAGamesInCity();
