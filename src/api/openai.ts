import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateCode = async (prompt: string): Promise<{ code: string }> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a Google Maps JavaScript code generator. Generate ONLY executable JavaScript code that works with the Google Maps API. 

CRITICAL: Return ONLY raw JavaScript code - NO markdown formatting, NO code blocks, NO explanations, NO comments except inline code comments.

Rules:
1. Always create a map with: const map = new google.maps.Map(document.getElementById("map"), {...})
2. Immediately after creating the map, add: window.map = map;
3. For routes, use DirectionsService and DirectionsRenderer
4. For markers, use google.maps.Marker
5. For shapes, use Circle, Polygon, Rectangle, Polyline
6. Include proper error handling for DirectionsService
7. Use real coordinates and place names
8. Return ONLY raw JavaScript code that can be executed directly with eval()

For driving routes:
- Use google.maps.DirectionsService() and google.maps.DirectionsRenderer()
- Set travelMode to google.maps.TravelMode.DRIVING
- Handle both string addresses and lat/lng coordinates
- Always check status === 'OK' before displaying results

Example output format (raw JavaScript, no markdown):
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 10,
  center: { lat: X, lng: Y }
});
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);
const request = {
  origin: "Origin Address",
  destination: "Destination Address",
  travelMode: google.maps.TravelMode.DRIVING
};
directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    let code = completion.choices[0]?.message?.content || '';
    
    // Remove markdown code blocks if present
    code = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '').trim();
    
    return { code };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock for any route request
    return generateFallbackRoute(prompt);
  }
};

const generateFallbackRoute = (prompt: string): { code: string } => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract city names or use defaults
  let origin = "New York, NY";
  let destination = "Boston, MA";
  let center = { lat: 41.4993, lng: -72.0000 };
  let zoom = 7;

  // Try to extract locations from prompt
  if (lowerPrompt.includes('to')) {
    const parts = lowerPrompt.split(' to ');
    if (parts.length === 2) {
      origin = parts[0].replace(/.*from\s+/i, '').trim();
      destination = parts[1].trim();
    }
  }

  return {
    code: `const map = new google.maps.Map(document.getElementById("map"), {
  zoom: ${zoom},
  center: { lat: ${center.lat}, lng: ${center.lng} }
});

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();
directionsRenderer.setMap(map);

const request = {
  origin: "${origin}",
  destination: "${destination}",
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  } else {
    console.error('Directions request failed due to ' + status);
  }
});`
  };
};