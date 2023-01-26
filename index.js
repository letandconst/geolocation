// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

let locationResult = $('#curr-location');

let city, regionResult, map, infoWindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -34.397, lng: 150.644 },
		zoom: 6,
	});

	infoWindow = new google.maps.InfoWindow();

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				var url =
					'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
					pos.lat +
					',' +
					pos.lng +
					'&key=AIzaSyD1lDeWCObDolArPKOXaO2OeQxAlgZBZGY';

				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						// console.log(data.results[0].address_components);
						data.results[0].address_components.forEach(function (
							address_component
						) {
							if (address_component.types[0] == 'administrative_area_level_2') {
								city = address_component.long_name;
							}

							if (address_component.types[0] == 'administrative_area_level_1') {
								regionResult = address_component.long_name;
							}
							infoWindow.setContent(city);
						});

						fetch('region-data.json')
							.then((response) => response.json())
							.then((data) => {
								for (const key in data) {
									let a = data[key].province_list;
									console.log('list', data[key].province_list);

									let exists = Object.keys(a).includes(city.toUpperCase());

									console.log('data', data);
									if (exists) {
										locationResult.append(city + ',' + data[key].region_name);
									} else {
										console.log('not matched');
									}
								}
							});
					});

				infoWindow.setPosition(pos);

				infoWindow.open(map);
				map.setCenter(pos);
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(
		browserHasGeolocation
			? 'Error: The Geolocation service failed.'
			: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
}

window.initMap = initMap;
