import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateCode } from './api/openai';

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  code?: string;
}


interface SliderControls {
  zoom: number;
  markerSize: number;
  heatmapRadius: number;
  styleOpacity: number;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  
  // New feature states
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [showSlidersPanel, setShowSlidersPanel] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState('');
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [fps, setFps] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [currentFollowUps, setCurrentFollowUps] = useState<string[]>([]);
  
  const [sliders, setSliders] = useState<SliderControls>({
    zoom: 12,
    markerSize: 1,
    heatmapRadius: 50,
    styleOpacity: 1
  });
  
  const lastPolyline = useRef<google.maps.Polyline | null>(null);
  const currentOverlays = useRef<any[]>([]);

  // Auto-complete suggestions
  const promptSuggestions = [
    // Routes
    "Show me a route from New York to Boston",
    "Create a route from Los Angeles to San Francisco", 
    "Display directions from Chicago to Detroit",
    "Route from Miami to Orlando",
    "Driving directions from Seattle to Portland",
    "Show me the fastest route from Tokyo to Osaka",
    "Create a route from London to Manchester",
    "Route from Paris to Lyon with waypoints",
    
    // Markers
    "Add markers in Tokyo with custom icons",
    "Show markers across Europe with info windows",
    "Create colored markers in New York",
    "Add multiple markers in San Francisco",
    "Show markers with clustering in London",
    "Display restaurant markers in Paris",
    "Add hotel markers in Rome",
    
    // Shapes
    "Draw a circle around Central Park",
    "Create a polygon over Manhattan",
    "Show a heatmap of traffic in Los Angeles",
    "Add a rectangle over Golden Gate Park",
    "Display delivery zones as circles",
    "Create service area polygons",
    
    // Advanced
    "Show traffic layer in downtown LA",
    "Add satellite view of the Grand Canyon",
    "Create a dark mode map of Tokyo",
    "Show terrain view of the Rocky Mountains",
    "Add transit layer to NYC map"
  ];

  // Load Maps API and initialize map
  useEffect(() => {
    const loadMapsAPI = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        console.log('Maps API already loaded');
        return;
      }

      const mapsApiKey = import.meta.env.VITE_MAPS_API_KEY || 
                        import.meta.env.VITE_NEXT_PUBLIC_MAPS_API_KEY || 
                        '';
      console.log('Loading Maps API, key available:', !!mapsApiKey);
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=geometry,drawing&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        initializeMap();
      };
      
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (mapElementRef.current && window.google) {
        mapRef.current = new google.maps.Map(mapElementRef.current, {
          zoom: 2,
          center: { lat: 0, lng: 0 },
        });
        
        // Just initialize the map, don't execute any code yet
      }
    };

    if (window.google) {
      initializeMap();
    } else {
      loadMapsAPI();
    }
  }, []); // Only run once on mount

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
  }, []);


  // Documentation generator
  const generateDocumentation = async () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.code) {
      alert('No code to document! Generate some map code first.');
      return;
    }

    setIsGeneratingDocs(true);
    setShowDocsModal(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a documentation generator for Google Maps JavaScript code. Create comprehensive, professional documentation in Markdown format. Include: overview, features, setup instructions, code explanation, customization options, and usage examples. Be detailed but concise.'
            },
            {
              role: 'user', 
              content: `Generate documentation for this Google Maps code that was created from the prompt: "${lastMessage.content || 'Google Maps feature'}"

Code:
${lastMessage.code}

Create professional README-style documentation explaining what this code does and how to use it.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const documentation = data.choices[0]?.message?.content || 'Failed to generate documentation.';
      setGeneratedDocs(documentation);

    } catch (error) {
      console.error('Error generating documentation:', error);
      setGeneratedDocs('Error generating documentation. Please try again.');
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  // Diff utility
  const generateDiff = (oldCode: string, newCode: string) => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';
      
      if (oldLine !== newLine) {
        diff.push({
          lineNumber: i + 1,
          old: oldLine,
          new: newLine,
          type: oldLine === '' ? 'added' : newLine === '' ? 'removed' : 'modified'
        });
      }
    }
    return diff;
  };


  // Slider handlers
  const handleSliderChange = (key: keyof SliderControls, value: number) => {
    console.log(`Slider ${key} changed to:`, value);
    setSliders(prev => ({ ...prev, [key]: value }));
    
    if (!mapRef.current) {
      console.log('No map reference available');
      return;
    }
    
    if (key === 'zoom') {
      console.log('Setting map zoom to:', value);
      mapRef.current.setZoom(value);
    }
    
    // Update existing overlays based on slider changes
    if (key === 'styleOpacity') {
      console.log('Updating overlay opacity to:', value);
      let foundExistingOverlays = false;
      
      currentOverlays.current.forEach(overlay => {
        if (overlay && overlay.setOptions) {
          if (overlay instanceof google.maps.Circle || overlay instanceof google.maps.Polygon) {
            foundExistingOverlays = true;
            console.log('Updating existing overlay opacity');
            overlay.setOptions({ 
              fillOpacity: value * 0.35, 
              strokeOpacity: value * 0.8 
            });
          }
        }
      });
      
      if (!foundExistingOverlays) {
        console.log('No existing overlays found for opacity control');
      }
    }
    
    // Update marker sizes - prioritize existing markers
    if (key === 'markerSize') {
      console.log('Marker size changed to:', value);
      let foundExistingMarkers = false;
      
      // Update any existing markers from generated code
      currentOverlays.current.forEach(overlay => {
        if (overlay instanceof google.maps.Marker && !(overlay as any).demoMarker) {
          foundExistingMarkers = true;
          console.log('Updating existing generated marker size');
          const currentIcon = overlay.getIcon();
          if (currentIcon && typeof currentIcon === 'object') {
            overlay.setIcon({
              ...currentIcon,
              scaledSize: new google.maps.Size(32 * value, 32 * value)
            });
          } else {
            // Fallback icon
            overlay.setIcon({
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(32 * value, 32 * value)
            });
          }
        }
      });
      
      // Only create demo marker if no existing markers found
      if (!foundExistingMarkers && mapRef.current) {
        // Remove any existing demo markers first
        currentOverlays.current = currentOverlays.current.filter(overlay => {
          if ((overlay as any).demoMarker) {
            overlay.setMap(null);
            return false;
          }
          return true;
        });
        
        const center = mapRef.current.getCenter();
        if (center) {
          console.log('No existing markers - creating demo marker for size testing');
          const demoMarker = new google.maps.Marker({
            position: center,
            map: mapRef.current,
            title: 'Demo Marker - Resize me with the slider!',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32 * value, 32 * value)
            }
          });
          (demoMarker as any).demoMarker = true;
          currentOverlays.current.push(demoMarker);
        }
      }
    }
    
    // Apply heatmap radius changes - prioritize existing circles
    if (key === 'heatmapRadius') {
      console.log('Heatmap radius changed to:', value);
      let foundExistingCircles = false;
      
      // First, try to update existing circles from generated code
      currentOverlays.current.forEach(overlay => {
        if (overlay instanceof google.maps.Circle && !(overlay as any).demoCircle) {
          foundExistingCircles = true;
          console.log('Updating existing generated circle radius');
          overlay.setRadius(value * 10); // Scale the radius
        }
      });
      
      // Only create demo circle if no existing circles found
      if (!foundExistingCircles && mapRef.current) {
        // Remove existing demo circle first
        currentOverlays.current = currentOverlays.current.filter(overlay => {
          if ((overlay as any).demoCircle) {
            overlay.setMap(null);
            return false;
          }
          return true;
        });
        
        const center = mapRef.current.getCenter();
        if (center) {
          console.log('No existing circles - creating demo heatmap circle');
          const demoCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.1,
            map: mapRef.current,
            center: center,
            radius: value * 10, // Scale the radius
          });
          (demoCircle as any).demoCircle = true;
          currentOverlays.current.push(demoCircle);
          console.log('Created demo heatmap circle with radius:', value * 10);
        }
      }
    }
  };

  const executeMapCode = (code: string) => {
    console.log('executeMapCode called with:', code);
    
    // Add to code history
    setCodeHistory(prev => [...prev, code]);
    
    // Reset controls to default values when new code is executed
    console.log('Resetting controls to defaults');
    setSliders({
      zoom: 12,
      markerSize: 1,
      heatmapRadius: 50,
      styleOpacity: 1
    });
    
    try {
      // Make sure the map element has the ID that the generated code expects
      if (mapElementRef.current) {
        mapElementRef.current.id = 'map';
        
        // Clear the map container completely to remove all previous content
        console.log('Clearing map container');
        mapElementRef.current.innerHTML = '';
      }
      
      // Reset the map reference and overlays
      mapRef.current = null;
      currentOverlays.current = [];
      
      
      // Create a safe execution context with access to necessary variables
      const google = window.google;
      const document = window.document;
      
      // Execute the code directly - this will create a fresh map
      console.log('About to execute code');
      
      // Override Google Maps classes to capture created objects
      const originalMarker = google.maps.Marker;
      const originalCircle = google.maps.Circle;
      const originalPolygon = google.maps.Polygon;
      const originalRectangle = google.maps.Rectangle;
      
      google.maps.Marker = function(opts: any) {
        const marker = new originalMarker(opts);
        console.log('Captured new marker from generated code');
        currentOverlays.current.push(marker);
        return marker;
      } as any;
      
      google.maps.Circle = function(opts: any) {
        const circle = new originalCircle(opts);
        console.log('Captured new circle from generated code');
        currentOverlays.current.push(circle);
        return circle;
      } as any;
      
      google.maps.Polygon = function(opts: any) {
        const polygon = new originalPolygon(opts);
        console.log('Captured new polygon from generated code');
        currentOverlays.current.push(polygon);
        return polygon;
      } as any;
      
      google.maps.Rectangle = function(opts: any) {
        const rectangle = new originalRectangle(opts);
        console.log('Captured new rectangle from generated code');
        currentOverlays.current.push(rectangle);
        return rectangle;
      } as any;
      
      eval(code);
      
      // Restore original classes
      google.maps.Marker = originalMarker;
      google.maps.Circle = originalCircle;
      google.maps.Polygon = originalPolygon;
      google.maps.Rectangle = originalRectangle;
      
      // After execution, get the map reference but DON'T apply old slider settings
      setTimeout(() => {
        // Try to find the map that was just created
        if (mapElementRef.current && mapElementRef.current.querySelector('.gm-style')) {
          console.log('Map found after code execution');
          // The map should be accessible via the global variable
          mapRef.current = (window as any).map;
        }
        
        console.log(`Map loaded with ${currentOverlays.current.length} captured overlays`);
      }, 500);
      
      console.log('Code executed successfully');
    } catch (error) {
      console.error('Error executing map code:', error);
      console.error('Code that failed:', code);
    }
  };

  // Handle input change with suggestions
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.length > 2) {
      const filtered = promptSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  // Generate follow-up suggestions based on generated code
  const generateFollowUps = (code: string, prompt: string) => {
    const lowerCode = code.toLowerCase();
    const lowerPrompt = prompt.toLowerCase();
    const followUps: string[] = [];

    // Route-based follow-ups
    if (lowerCode.includes('directionsservice') || lowerCode.includes('directionsrenderer')) {
      followUps.push('Add waypoints to this route');
      followUps.push('Show alternative routes');
      followUps.push('Add traffic layer');
      followUps.push('Change to walking directions');
    }

    // Marker-based follow-ups  
    if (lowerCode.includes('marker') && !lowerCode.includes('new google.maps.marker')) {
      followUps.push('Add clustering to markers');
      followUps.push('Add custom marker icons');
      followUps.push('Add info windows to markers');
    } else if (lowerCode.includes('new google.maps.marker')) {
      followUps.push('Add more markers nearby');
      followUps.push('Add custom marker icon');
      followUps.push('Add info window');
    }

    // Shape-based follow-ups
    if (lowerCode.includes('circle')) {
      followUps.push('Make circle draggable');
      followUps.push('Add multiple circles');
      followUps.push('Change circle color');
    }

    if (lowerCode.includes('polygon')) {
      followUps.push('Make polygon editable');
      followUps.push('Add polygon stroke animation');
      followUps.push('Fill polygon with pattern');
    }

    if (lowerCode.includes('rectangle')) {
      followUps.push('Make rectangle resizable');
      followUps.push('Add multiple rectangles');
      followUps.push('Change rectangle style');
    }

    // Map style follow-ups
    if (lowerCode.includes('styles:') || lowerCode.includes('maptypeid')) {
      followUps.push('Switch to satellite view');
      followUps.push('Add custom map styling');
      followUps.push('Toggle between map types');
    } else {
      followUps.push('Apply dark mode styling');
      followUps.push('Switch to satellite view');
      followUps.push('Add custom map theme');
    }

    // Location-specific follow-ups
    if (lowerPrompt.includes('new york') || lowerPrompt.includes('nyc')) {
      followUps.push('Show NYC subway lines');
      followUps.push('Add popular NYC landmarks');
      followUps.push('Show Central Park boundaries');
    }

    if (lowerPrompt.includes('tokyo')) {
      followUps.push('Add Tokyo train lines');
      followUps.push('Show Tokyo districts');
      followUps.push('Add shrine and temple markers');
    }

    if (lowerPrompt.includes('london')) {
      followUps.push('Add London Underground lines');
      followUps.push('Show Thames river path');
      followUps.push('Add historic landmarks');
    }

    // Advanced feature follow-ups
    if (!lowerCode.includes('trafficlayer')) {
      followUps.push('Add real-time traffic');
    }

    if (!lowerCode.includes('infowindow')) {
      followUps.push('Add interactive info windows');
    }

    // Remove duplicates and limit to 4 suggestions
    const uniqueFollowUps = [...new Set(followUps)];
    return uniqueFollowUps.slice(0, 4);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowFollowUps(false); // Hide follow-ups when new message is sent
    setIsLoading(true);

    try {
      // Use mock API for development
      const data = await generateCode(`Generate Google Maps JavaScript code for: ${inputValue}. Return only the JavaScript code that works with the Google Maps API. Include proper initialization if needed.`);
      
      const aiMessage: ChatMessage = { 
        type: 'ai', 
        content: 'Here\'s the generated code:',
        code: data.code 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Execute the generated code on the map
      if (data.code) {
        console.log('Executing code:', data.code);
        executeMapCode(data.code);
        
        // Generate and show follow-up suggestions
        const followUps = generateFollowUps(data.code, inputValue);
        if (followUps.length > 0) {
          setCurrentFollowUps(followUps);
          setShowFollowUps(true);
        }
      } else {
        console.log('No code to execute');
      }
    } catch (error) {
      const errorMessage: ChatMessage = { 
        type: 'ai', 
        content: 'Sorry, I encountered an error generating the code. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="app">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-logo">MapScriptor</div>
          <div className="nav-links">
            <a href="https://github.com/aisha-sk/google-maps-ai-copilot" className="nav-link" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <div className="hero-title-main">MAPSCRIPTOR</div>
            <div className="hero-title-sub">AI Copilot for Google Maps</div>
          </h1>
          <p className="hero-subtitle">
            Made by a developer, for developers. <br></br><br></br> MapScriptor instantly visualizes your generated JavaScript with live preview and interactive controls. Debug and iterate in real-time before shipping to production.
          </p>
          {/* <div className="hero-features">
            <div className="hero-feature">
              <span>Instant live preview of generated map code</span>
            </div>
            <div className="hero-feature">
              <span>Interactive controls to test zoom, markers, and overlays</span>
            </div>
            <div className="hero-feature">
              <span>Debug and iterate faster than copy-pasting from ChatGPT</span>
            </div>
          </div> */}
          <a href="#editor-section" className="cta-button">Try Live Preview</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Build Maps Faster</h2>
          <p className="features-subtitle">Generate, preview, and ship map code; no docs required.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Natural Prompts</h3>
              <p className="feature-description">Type what you need and get JS code instantly.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h3 className="feature-title">Live Preview</h3>
              <p className="feature-description">See changes render on the map in real time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Copy & Paste</h3>
              <p className="feature-description">Copy production-ready snippets into your app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Editor and Preview Section */}
      <section id="editor-section" className="workspace">
        <div className="workspace-container">
          <div className="panel chat-panel">
            <h3 className="panel-title">Chat with AI</h3>
            <div className="panel-content">
              <div id="chat-container" className="chat-container">
                {messages.map((message, index) => (
                  <div key={index} className={`chat ${message.type}`}>
                    {message.type === 'user' ? (
                      message.content
                    ) : (
                      <div>
                        <p>{message.content}</p>
                        {message.code && (
                          <div className="code-block">
                            <button 
                              className="copy-btn"
                              onClick={() => copyToClipboard(message.code!)}
                              title="Copy code"
                            >
                              📋
                            </button>
                            <pre>{message.code}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat ai loading">
                    <p>Generating code...</p>
                  </div>
                )}
                
                {/* Follow-up suggestions */}
                {showFollowUps && currentFollowUps.length > 0 && (
                  <div className="follow-ups-container">
                    <div className="follow-ups-title">Try these next:</div>
                    <div className="follow-ups-grid">
                      {currentFollowUps.map((followUp, index) => (
                        <button
                          key={index}
                          className="follow-up-btn"
                          onClick={() => {
                            setInputValue(followUp);
                            setShowFollowUps(false);
                          }}
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                    <button 
                      className="dismiss-follow-ups"
                      onClick={() => setShowFollowUps(false)}
                      title="Dismiss suggestions"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <div className="chat-input">
                <div className="input-container">
                  <input 
                    type="text" 
                    placeholder="Type your map prompt…" 
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    onFocus={() => inputValue.length > 2 && setShowSuggestions(filteredSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    disabled={isLoading}
                  />
                  {showSuggestions && (
                    <div className="suggestions-dropdown">
                      {filteredSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="suggestion-item"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={sendMessage} disabled={isLoading}>
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>

          <div className="panel preview-panel">
            <h3 className="panel-title">Live Preview</h3>
            <div className="panel-content">
              <div 
                ref={mapElementRef}
                id="map" 
                className="map-container"
                style={{ width: '100%', height: '400px' }}
              >
                <div className="map-placeholder-content">
                  <div className="map-icon">🗺️</div>
                  <p>Loading Google Map...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Feature Controls */}
        <div className="feature-controls">
          <div className="control-group">
            {/* Code History & Diff */}
            <button 
              className="feature-btn"
              onClick={() => setShowDiffModal(true)}
              disabled={codeHistory.length < 1}
            >
              📋 View Code History ({codeHistory.length})
            </button>
            
            {/* Documentation Generator */}
            <button 
              className="feature-btn"
              onClick={generateDocumentation}
              disabled={!messages.some(m => m.code) || isGeneratingDocs}
            >
              {isGeneratingDocs ? '⏳ Generating...' : '📝 Generate Docs'}
            </button>

            {/* Sliders Panel */}
            <button 
              className="feature-btn"
              onClick={() => setShowSlidersPanel(!showSlidersPanel)}
            >
              🎛️ Controls
            </button>
            
          </div>
        </div>
      </section>

      {/* Performance Overlay */}
      <div className="performance-overlay">
        <div className="fps-counter">FPS: {fps}</div>
      </div>

      {/* Sliders Panel */}
      {showSlidersPanel && (
        <div className="sliders-panel">
          <div className="sliders-content">
            <h4>Live Controls</h4>
            <button 
              className="close-btn"
              onClick={() => setShowSlidersPanel(false)}
            >
              ×
            </button>
            
            <div className="slider-group">
              <label>Zoom: {sliders.zoom}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={sliders.zoom}
                onChange={(e) => handleSliderChange('zoom', Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <label>Marker Size: {sliders.markerSize}x</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={sliders.markerSize}
                onChange={(e) => handleSliderChange('markerSize', Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <label>Heatmap Radius: {sliders.heatmapRadius}px</label>
              <input
                type="range"
                min="10"
                max="200"
                value={sliders.heatmapRadius}
                onChange={(e) => handleSliderChange('heatmapRadius', Number(e.target.value))}
              />
            </div>
            
            <div className="slider-group">
              <label>Style Opacity: {Math.round(sliders.styleOpacity * 100)}%</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sliders.styleOpacity}
                onChange={(e) => handleSliderChange('styleOpacity', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}


      {/* Diff Modal */}
      {showDiffModal && codeHistory.length >= 1 && (
        <div className="modal-overlay">
          <div className="modal-content diff-modal">
            <div className="modal-header">
              <h3>Code History ({codeHistory.length} versions)</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDiffModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {codeHistory.length >= 2 ? (
                <>
                  <div className="diff-container">
                    <div className="diff-side">
                      <h4>Previous ({codeHistory.length - 1})</h4>
                      <pre className="diff-code">
                        {codeHistory[codeHistory.length - 2]}
                      </pre>
                    </div>
                    <div className="diff-side">
                      <h4>Current ({codeHistory.length})</h4>
                      <pre className="diff-code">
                        {codeHistory[codeHistory.length - 1]}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="diff-summary">
                    <h4>Changes Summary</h4>
                    <div className="diff-stats">
                      {(() => {
                        const diff = generateDiff(
                          codeHistory[codeHistory.length - 2],
                          codeHistory[codeHistory.length - 1]
                        );
                        return (
                          <div>
                            <p>{diff.length} lines changed</p>
                            {diff.slice(0, 10).map((change, i) => (
                              <div key={i} className={`diff-line diff-${change.type}`}>
                                Line {change.lineNumber}: {change.type}
                              </div>
                            ))}
                            {diff.length > 10 && <p>... and {diff.length - 10} more changes</p>}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </>
              ) : (
                <div className="single-code-view">
                  <h4>Latest Code (Version {codeHistory.length})</h4>
                  <pre className="diff-code">
                    {codeHistory[codeHistory.length - 1]}
                  </pre>
                  <p style={{color: '#888', marginTop: '1rem'}}>
                    Generate another code snippet to see diffs!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documentation Modal */}
      {showDocsModal && (
        <div className="modal-overlay">
          <div className="modal-content docs-modal">
            <div className="modal-header">
              <h3>Generated Documentation</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDocsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {isGeneratingDocs ? (
                <div className="loading-docs">
                  <p>🤖 AI is generating comprehensive documentation...</p>
                </div>
              ) : (
                <div className="docs-content">
                  <div className="docs-actions">
                    <button 
                      className="copy-docs-btn"
                      onClick={() => navigator.clipboard.writeText(generatedDocs)}
                    >
                      📋 Copy Documentation
                    </button>
                  </div>
                  <pre className="docs-text">{generatedDocs}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">About This Project</h4>
              <p className="footer-text">
                This project was created as a submission for the Google Maps Platform Awards hackathon.
              </p>
            </div>
            
            <div className="footer-section footer-contact">
              <h4 className="footer-title">Contact</h4>
              <div className="footer-links">
                <a href="https://aishask.com" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Website
                </a>
                <a href="https://www.linkedin.com/in/aishasuhailkhan/" className="footer-link" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/aisha-sk" className="footer-link" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 MapScriptor | Created by Aisha Suhail Khan</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;