const http = require('http');
const fs = require('fs');
require('dotenv').config();

const server = http.createServer(function (request, response) {
	if (request.url.startsWith('/search')) {
		const city = request.url.split('=')[1].split('&')[0];
		const startDate = request.url.split('&start_date=')[1];
		console.log('city', city);
		console.log('startDate', startDate);
		fetch(
			`https://api.seatgeek.com/2/events?taxonomies.name=nba&venue.city=${city}&datetime_utc.gt=${startDate}&client_id=${process.env.CLIENT_ID}`
		)
			.then(function (seatGeekResponse) {
				// console.log(seatGeekResponse);
				return seatGeekResponse.json();
			})
			.then(function (seatGeekData) {
				response.writeHead(200, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify(seatGeekData));
			})
			.catch(function (error) {
				response.writeHead(500, { 'Content-Type': 'text/plain' });
				response.end('Error', error);
			});
	} else {
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
	}
});
server.listen(process.env.PORT);
console.log(`Server running at ${process.env.PORT}`);
