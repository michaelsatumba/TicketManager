document
	.getElementById('searchForm')
	.addEventListener('submit', function (event) {
		event.preventDefault();

		const city = document.getElementById('city').value;
		const url = 'http://localhost:3000/search?city=' + city;
		// let html = '';

		fetch(url)
			.then(function (response) {
				// console.log(response);
				return response.json();
			})
			.then(function (data) {
				const events = data.events;
				const ctx = document.getElementById('myChart').getContext('2d');
				const chart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: [], // Add the event dates here
						datasets: [
							{
								label: 'Lowest Price',
								data: [], // Add the lowest prices here
								backgroundColor: 'rgba(255, 99, 132, 0.2)',
								borderColor: 'rgba(255, 99, 132, 1)',
								borderWidth: 1,
							},
						],
					},
					options: {
						maintainAspectRatio: false,
						// responsive: false,
						tooltips: {
							callbacks: {
								label: function (tooltipItem, data) {
									const event = events[tooltipItem.index];
									return event.title + ': $' + event.stats.lowest_price;
								},
							},
							mode: 'index',
							intersect: false,
						},
						onClick: function (e, activeElements) {
							if (activeElements.length > 0) {
								const event = events[activeElements[0]._index];
								window.open(event.url, '_blank');
							}
						},
						scales: {
							xAxes: [
								{
									stacked: true,
								},
							],
							yAxes: [
								{
									stacked: true,
								},
							],
						},
					},
				});
				events.forEach(function (event) {
					const date = new Date(event.datetime_local);
					chart.data.labels.push(date.toLocaleDateString());
					chart.data.datasets[0].data.push(event.stats.lowest_price);
					// html +=
					// 	'<p>' +
					// 	event.title +
					// 	' at ' +
					// 	event.venue.name +
					// 	' on ' +
					// 	date.toLocaleDateString() +
					// 	'</p>' +
					// 	'$' +
					// 	event.stats.lowest_price;
				});
				// document.getElementById('results').innerHTML = html;
				chart.update();
			})
			.catch(function (error) {
				console.error(error);
			});
	});
