document
	.getElementById('searchForm')
	.addEventListener('submit', function (event) {
		event.preventDefault();

		const city = document.getElementById('city').value;
		const url = 'http://localhost:3000/search?city=' + city;

		fetch(url)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				console.log(data);
				const events = data.events;
				let html = '';
				events.forEach(function (event) {
					const date = new Date(event.datetime_local);
					html +=
						'<p>' +
						event.title +
						' at ' +
						event.venue.name +
						' on ' +
						date.toLocaleDateString() +
						'</p>';
				});
				document.getElementById('results').innerHTML = html;
			})
			.catch(function (error) {
				console.error(error);
			});
	});
