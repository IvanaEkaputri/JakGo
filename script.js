var selectedMode = "DRIVING";
var currentTime = new Date();
var currentHour = currentTime.getHours();
var transitCostPerRide = (currentHour >= 5 && currentHour < 7) ? 2000 : 3500;

function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();
  
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: -6.200000, lng: 106.816666 },
    disableDefaultUI: true,
    styles:
    [
        {
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f5f5f5"
            }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#616161"
            }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
            {
                "color": "#f5f5f5"
            }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#bdbdbd"
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#eeeeee"
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#757575"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e5e5e5"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#ffffff"
            }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#757575"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#dadada"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#616161"
            }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e5e5e5"
            }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#eeeeee"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#c9c9c9"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#77d8c5"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        }
    ]
});
directionsRenderer.setMap(map);
directionsRenderer.setOptions({
    polylineOptions: {
        strokeColor: '#D88787',
        strokeWeight: 6
    }
});

  var originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
  var destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));

  document.getElementById('directions-form').addEventListener('submit', function (event) {
    event.preventDefault();
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var origin = document.getElementById('origin').value;
  var destination = document.getElementById('destination').value;

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: selectedMode,
    },
    function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        var route = response.routes[0];
        var duration = route.legs[0].duration.text;
        var transitCost = 0;
        var instructions = '';
        console.log(route.legs[0]);

        const myNode = document.getElementById("overview");
        myNode.innerHTML = '';       
        for (let i = 0; i < route.legs[0].steps.length; i++) {
          if(selectedMode == 'TRANSIT'){
              if(route.legs[0].steps[i].travel_mode == 'TRANSIT'){
                if (route.legs[0].steps[i].transit.line.vehicle.name == 'Train'){
                    const train = document.createElement("img");
                    train.setAttribute("src", "https://maps.gstatic.com/mapfiles/transit/iw2/svg/rail2.svg");
                    train.setAttribute("height", "15");
                    train.setAttribute("width", "15");
                    document.getElementById("overview").appendChild(train);
                }
                if (route.legs[0].steps[i].transit.line.vehicle.name == 'Bus'){
                    const bus = document.createElement("img");
                    bus.setAttribute("src", "https://maps.gstatic.com/mapfiles/transit/iw2/svg/bus2.svg");
                    bus.setAttribute("height", "15");
                    bus.setAttribute("width", "15");
                    document.getElementById("overview").appendChild(bus);    
                }
                const transLbl = document.createElement("p");
                var lbl = '';
                if(route.legs[0].steps[i].transit.line.short_name){
                    lbl = document.createTextNode(route.legs[0].steps[i].transit.line.short_name);
                }
                else{
                    lbl = document.createTextNode(route.legs[0].steps[i].transit.line.name);
                }
                transLbl.appendChild(lbl);
                transLbl.setAttribute("class", "transitLabel");
                transLbl.setAttribute("style", "color: " + route.legs[0].steps[i].transit.line.text_color + ";background-color: " + route.legs[0].steps[i].transit.line.color + ";");
                document.getElementById("overview").appendChild(transLbl);
              }  
              else if(route.legs[0].steps[i].travel_mode == 'WALKING'){
                const image = document.createElement("img");
                image.setAttribute("src", "https://maps.gstatic.com/mapfiles/transit/iw2/svg/walk.svg");
                image.setAttribute("height", "15");
                image.setAttribute("width", "15");
                document.getElementById("overview").appendChild(image);
              }
              if(i+1 < route.legs[0].steps.length){
                const image = document.createElement("img");
                image.setAttribute("src", "https://maps.gstatic.com/tactile/directions/cards/arrow-right-1x.png");
                image.setAttribute("height", "15");
                image.setAttribute("width", "15");
                document.getElementById("overview").appendChild(image);
              }
          }  

          try {
            var step = route.legs[0].steps[i];
            var instruction = step.instructions;

            if (step.travel_mode === 'TRANSIT') {
              var transitDetails = step.transit;
              var transitLine = transitDetails.line.short_name;
              var transitDepartureStop = transitDetails.departure_stop.name;
              var transitArrivalStop = transitDetails.arrival_stop.name;

              instruction += ' - Take ' + transitLine + ' from ' + transitDepartureStop + ' to ' + transitArrivalStop;
            }

            instructions += '<div class="instruction">' + instruction + '</div>' + "<br>";

            // Calculate transit cost if applicable
            if (step.transit && step.transit.line.vehicle.name === 'Train') {
              if (step.distance.value <= 25000) {
                transitCost += 3000;
              } else {
                transitCost += 3000;
                var distance = step.distance.value - 25000;
                distance = Math.ceil(distance / 10000);
                transitCost += distance * 1000;
              }
            } else if (step.transit && step.transit.line.vehicle.name === 'Bus') {
              transitCost += transitCostPerRide;
            }
          } catch (error) {
            console.error(error);
          }
        }

        document.getElementById('duration').textContent = 'Estimated Travel Duration: ' + duration;
        if (selectedMode === 'TRANSIT') {
          document.getElementById('cost').textContent = 'Estimated Transit Cost: ~ Rp. ' + transitCost;
        } else {
          document.getElementById('cost').textContent = '';
        }

        document.getElementById('instructions').innerHTML = instructions;
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
}

function changeTravelMode(mode){
  selectedMode = mode;
}

var swipeUpMenu = document.getElementById('swipeUpMenu');

function openMenu() {
  swipeUpMenu.classList.add('open');
}

function closeMenu() {
  swipeUpMenu.classList.remove('open');
}
