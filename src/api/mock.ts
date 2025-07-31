// Mock API for development
export const generateCode = async (prompt: string): Promise<{ code: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerPrompt = prompt.toLowerCase();
  
  // DIRECTIONS & ROUTES - check FIRST before any landmarks
  if (lowerPrompt.includes('directions') || lowerPrompt.includes('driving') || lowerPrompt.includes('route')) {
    // NYC Routes
    if ((lowerPrompt.includes('brooklyn') && lowerPrompt.includes('times')) ||
        (lowerPrompt.includes('brooklyn bridge') && lowerPrompt.includes('times square'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7505, lng: -73.9934 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: { lat: 40.7061, lng: -73.9969 }, // Brooklyn Bridge
  destination: { lat: 40.7580, lng: -73.9855 }, // Times Square
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // New York to Boston
    if ((lowerPrompt.includes('new york') && lowerPrompt.includes('boston')) ||
        (lowerPrompt.includes('nyc') && lowerPrompt.includes('boston'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 7,
  center: { lat: 41.4993, lng: -72.0000 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: "New York, NY",
  destination: "Boston, MA",
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // Los Angeles to San Francisco
    if ((lowerPrompt.includes('los angeles') && lowerPrompt.includes('san francisco')) ||
        (lowerPrompt.includes('la') && lowerPrompt.includes('sf'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 6,
  center: { lat: 36.7783, lng: -119.4179 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: "Los Angeles, CA",
  destination: "San Francisco, CA",
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // Chicago to Detroit
    if ((lowerPrompt.includes('chicago') && lowerPrompt.includes('detroit'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 7,
  center: { lat: 42.3314, lng: -86.9066 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: "Chicago, IL",
  destination: "Detroit, MI",
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // Generic route patterns
    if (lowerPrompt.includes('times square') && lowerPrompt.includes('central park')) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 14,
  center: { lat: 40.7669, lng: -73.9716 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: { lat: 40.7580, lng: -73.9855 }, // Times Square
  destination: { lat: 40.7812, lng: -73.9665 }, // Central Park
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // Golden Gate Bridge to Fisherman's Wharf
    if ((lowerPrompt.includes('golden gate') && lowerPrompt.includes('fisherman')) ||
        (lowerPrompt.includes('golden gate bridge') && lowerPrompt.includes('wharf'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 37.8199, lng: -122.4598 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge
  destination: { lat: 37.8080, lng: -122.4177 }, // Fisherman's Wharf
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // LAX to Hollywood
    if ((lowerPrompt.includes('lax') && lowerPrompt.includes('hollywood')) ||
        (lowerPrompt.includes('airport') && lowerPrompt.includes('hollywood'))) {
      return {
        code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 11,
  center: { lat: 34.0307, lng: -118.3538 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: { lat: 33.9425, lng: -118.4081 }, // LAX Airport
  destination: { lat: 34.0928, lng: -118.3287 }, // Hollywood
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
      };
    }

    // Generic driving route fallback
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7589, lng: -73.9851 },
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: { lat: 40.7589, lng: -73.9851 }, // NYC Center
  destination: { lat: 40.7812, lng: -73.9665 }, // Central Park
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
    };
  }
  
  // LANDMARKS & SPECIFIC LOCATIONS
  if (lowerPrompt.includes('eiffel tower')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 16,
  center: { lat: 48.8584, lng: 2.2945 }, // Eiffel Tower
});

const marker = new google.maps.Marker({
  position: { lat: 48.8584, lng: 2.2945 },
  map: map,
  title: "Eiffel Tower"
});`
    };
  }
  
  if (lowerPrompt.includes('times square')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 17,
  center: { lat: 40.7580, lng: -73.9855 }, // Times Square
});

const marker = new google.maps.Marker({
  position: { lat: 40.7580, lng: -73.9855 },
  map: map,
  title: "Times Square"
});`
    };
  }
  
  if (lowerPrompt.includes('big ben')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 16,
  center: { lat: 51.4994, lng: -0.1245 }, // Big Ben
});

const marker = new google.maps.Marker({
  position: { lat: 51.4994, lng: -0.1245 },
  map: map,
  title: "Big Ben"
});`
    };
  }
  
  if (lowerPrompt.includes('golden gate bridge')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15,
  center: { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge
});

const marker = new google.maps.Marker({
  position: { lat: 37.8199, lng: -122.4783 },
  map: map,
  title: "Golden Gate Bridge"
});`
    };
  }
  
  if (lowerPrompt.includes('statue of liberty')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 16,
  center: { lat: 40.6892, lng: -74.0445 }, // Statue of Liberty
});

const marker = new google.maps.Marker({
  position: { lat: 40.6892, lng: -74.0445 },
  map: map,
  title: "Statue of Liberty"
});`
    };
  }
  
  if (lowerPrompt.includes('tokyo tower')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 16,
  center: { lat: 35.6586, lng: 139.7454 }, // Tokyo Tower
});

const marker = new google.maps.Marker({
  position: { lat: 35.6586, lng: 139.7454 },
  map: map,
  title: "Tokyo Tower"
});`
    };
  }
  
  if (lowerPrompt.includes('arc de triomphe')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 16,
  center: { lat: 48.8738, lng: 2.2950 }, // Arc de Triomphe
});

const marker = new google.maps.Marker({
  position: { lat: 48.8738, lng: 2.2950 },
  map: map,
  title: "Arc de Triomphe"
});`
    };
  }
  
  // SHAPES & AREAS
  if (lowerPrompt.includes('central park') && lowerPrompt.includes('circle')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 14,
  center: { lat: 40.7812, lng: -73.9665 }, // Central Park
});

const centralParkCircle = new google.maps.Circle({
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  map: map,
  center: { lat: 40.7812, lng: -73.9665 },
  radius: 800,
});`
    };
  }
  
  if (lowerPrompt.includes('manhattan') && lowerPrompt.includes('polygon')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 40.7831, lng: -73.9712 }, // Manhattan
});

const manhattanCoords = [
  { lat: 40.8776, lng: -73.9102 },
  { lat: 40.8020, lng: -73.9102 },
  { lat: 40.7082, lng: -74.0134 },
  { lat: 40.7648, lng: -74.0134 }
];

const manhattanPolygon = new google.maps.Polygon({
  paths: manhattanCoords,
  strokeColor: "#0000FF",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#0000FF",
  fillOpacity: 0.35,
  map: map
});`
    };
  }
  
  if (lowerPrompt.includes('golden gate park') && lowerPrompt.includes('rectangle')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 14,
  center: { lat: 37.7694, lng: -122.4862 }, // Golden Gate Park
});

const ggParkBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(37.7665, -122.5108),
  new google.maps.LatLng(37.7731, -122.4556)
);

const rectangle = new google.maps.Rectangle({
  bounds: ggParkBounds,
  editable: false,
  draggable: false,
  strokeColor: "#00FF00",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#00FF00",
  fillOpacity: 0.35,
  map: map
});`
    };
  }
  
  if (lowerPrompt.includes('louvre') && lowerPrompt.includes('circle')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15,
  center: { lat: 48.8606, lng: 2.3376 }, // Louvre
});

const louvreCircle = new google.maps.Circle({
  strokeColor: "#800080",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#800080",
  fillOpacity: 0.35,
  map: map,
  center: { lat: 48.8606, lng: 2.3376 },
  radius: 300,
});`
    };
  }
  
  if (lowerPrompt.includes('hyde park') && lowerPrompt.includes('polygon')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 14,
  center: { lat: 51.5085, lng: -0.1552 }, // Hyde Park
});

const hydeParkCoords = [
  { lat: 51.5138, lng: -0.1726 },
  { lat: 51.5138, lng: -0.1378 },
  { lat: 51.5033, lng: -0.1378 },
  { lat: 51.5033, lng: -0.1726 }
];

const hydeParkPolygon = new google.maps.Polygon({
  paths: hydeParkCoords,
  strokeColor: "#FFFF00",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FFFF00",
  fillOpacity: 0.35,
  map: map
});`
    };
  }
  
  // MAP STYLING
  if (lowerPrompt.includes('dark mode') || lowerPrompt.includes('dark theme')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 10,
  center: { lat: 40.7128, lng: -74.0060 },
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }]
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }]
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }]
    }
  ]
});`
    };
  }
  
  if (lowerPrompt.includes('satellite')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 },
  mapTypeId: google.maps.MapTypeId.SATELLITE
});`
    };
  }
  
  if (lowerPrompt.includes('terrain')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 10,
  center: { lat: 37.7749, lng: -122.4194 },
  mapTypeId: google.maps.MapTypeId.TERRAIN
});`
    };
  }
  
  if (lowerPrompt.includes('hybrid')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 },
  mapTypeId: google.maps.MapTypeId.HYBRID
});`
    };
  }
  
  if (lowerPrompt.includes('retro')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 },
  styles: [
    {
      featureType: "administrative",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "water",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "landscape",
      stylers: [{ visibility: "simplified" }]
    },
    {
      featureType: "road.highway",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road.local",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "water",
      stylers: [{ color: "#84afa3" }, { lightness: 52 }]
    },
    {
      stylers: [{ saturation: -17 }, { gamma: 0.36 }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#3f518c" }]
    }
  ]
});`
    };
  }
  
  // TRAFFIC & ADVANCED FEATURES
  if (lowerPrompt.includes('traffic')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
});

const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);`
    };
  }
  
  
  if (lowerPrompt.includes('walking') && lowerPrompt.includes('central park')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15,
  center: { lat: 40.7812, lng: -73.9665 },
});

const walkingPath = new google.maps.Polyline({
  path: [
    { lat: 40.7829, lng: -73.9654 },
    { lat: 40.7812, lng: -73.9665 },
    { lat: 40.7794, lng: -73.9632 },
    { lat: 40.7805, lng: -73.9700 },
    { lat: 40.7829, lng: -73.9654 }
  ],
  geodesic: true,
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 3,
  map: map
});`
    };
  }
  
  // MULTIPLE MARKERS
  if (lowerPrompt.includes('multiple markers') || lowerPrompt.includes('markers across')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 11,
  center: { lat: 35.6762, lng: 139.6503 }, // Tokyo
});

const locations = [
  { lat: 35.6586, lng: 139.7454, title: "Tokyo Tower" },
  { lat: 35.6762, lng: 139.6503, title: "Tokyo Station" },
  { lat: 35.6895, lng: 139.6917, title: "Imperial Palace" },
  { lat: 35.7090, lng: 139.7319, title: "Ueno Park" },
  { lat: 35.6581, lng: 139.7414, title: "Tsukiji Market" }
];

locations.forEach(location => {
  new google.maps.Marker({
    position: { lat: location.lat, lng: location.lng },
    map: map,
    title: location.title
  });
});`
    };
  }
  
  // INFO WINDOWS
  if (lowerPrompt.includes('info window') || lowerPrompt.includes('custom info')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 15,
  center: { lat: 40.7580, lng: -73.9855 }, // Times Square
});

const marker = new google.maps.Marker({
  position: { lat: 40.7580, lng: -73.9855 },
  map: map,
  title: "Times Square"
});

const infoWindow = new google.maps.InfoWindow({
  content: '<div><h3>Times Square</h3><p>The heart of NYC!</p></div>'
});

marker.addListener('click', () => {
  infoWindow.open(map, marker);
});`
    };
  }
  
  // BASIC CITIES
  if (lowerPrompt.includes('tokyo')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 35.6762, lng: 139.6503 }, // Tokyo, Japan
});`
    };
  }
  
  if (lowerPrompt.includes('paris')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 48.8566, lng: 2.3522 }, // Paris, France
});`
    };
  }
  
  if (lowerPrompt.includes('london')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 51.5074, lng: -0.1278 }, // London, UK
});`
    };
  }
  
  if (lowerPrompt.includes('new york') || lowerPrompt.includes('nyc')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 40.7128, lng: -74.0060 }, // New York City
});`
    };
  }
  
  if (lowerPrompt.includes('san francisco')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
});`
    };
  }
  
  // COLORED MARKERS - check for color words with marker context
  if ((lowerPrompt.includes('red') && lowerPrompt.includes('marker')) || lowerPrompt.includes('red marker')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7589, lng: -73.9851 },
});

const marker = new google.maps.Marker({
  position: { lat: 40.7589, lng: -73.9851 },
  map: map,
  title: "Red Marker",
  icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
});`
    };
  }
  
  if ((lowerPrompt.includes('blue') && lowerPrompt.includes('marker')) || lowerPrompt.includes('blue marker')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7589, lng: -73.9851 },
});

const marker = new google.maps.Marker({
  position: { lat: 40.7589, lng: -73.9851 },
  map: map,
  title: "Blue Marker",
  icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
});`
    };
  }
  
  if ((lowerPrompt.includes('green') && lowerPrompt.includes('marker')) || lowerPrompt.includes('green marker')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7589, lng: -73.9851 },
});

const marker = new google.maps.Marker({
  position: { lat: 40.7589, lng: -73.9851 },
  map: map,
  title: "Green Marker",
  icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
});`
    };
  }
  
  if (lowerPrompt.includes('marker')) {
    return {
      code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 40.7589, lng: -73.9851 },
});

const marker = new google.maps.Marker({
  position: { lat: 40.7589, lng: -73.9851 },
  map: map,
  title: "Marker"
});`
    };
  }
  
  // Default response for unknown requests
  return {
    code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 2,
  center: { lat: 0, lng: 0 }, // World view
});

// Generated code for: ${prompt}`
  };
};