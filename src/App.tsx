import React from 'react';

function App() {
  return (
    <div className="app">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-logo">MapScriptor</div>
          <div className="nav-links">
            <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">GitHub</a>
            <button className="sign-in-btn">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">MapScriptor: AI Copilot for Google Maps</h1>
          <p className="hero-subtitle">
            Build map features in seconds with plain-English prompts.
          </p>
          <a href="#editor-section" className="cta-button">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Build Maps Faster</h2>
          <p className="features-subtitle">Generate, preview, and ship map code—no docs required.</p>
          
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
                <div className="chat user">
                  Show me a map of San Francisco with a marker
                </div>
                <div className="chat ai">
                  <pre>{`const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 13,
  center: { lat: 37.7749, lng: -122.4194 },
});

const marker = new google.maps.Marker({
  position: { lat: 37.7749, lng: -122.4194 },
  map: map,
  title: "Hello San Francisco!"
});`}</pre>
                </div>
                <div className="chat user">
                  Add a red circle around the Golden Gate Bridge
                </div>
                <div className="chat ai">
                  <pre>{`const circle = new google.maps.Circle({
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  map,
  center: { lat: 37.8199, lng: -122.4783 },
  radius: 500,
});`}</pre>
                </div>
              </div>
              <div className="chat-input">
                <input id="prompt-input" type="text" placeholder="Type your map prompt…" />
                <button id="send-button">Send</button>
              </div>
            </div>
          </div>

          <div className="panel preview-panel">
            <h3 className="panel-title">Live Preview</h3>
            <div className="panel-content">
              <div id="map" className="map-placeholder">
                <div className="map-placeholder-content">
                  <div className="map-icon">🗺️</div>
                  <p>Interactive Google Map will render here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;