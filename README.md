# MapScriptor 🗺️

**AI Copilot for Google Maps** - Generate, preview, and iterate on Google Maps JavaScript code with live visual feedback.

## What is MapScriptor?

MapScriptor is an AI-powered development tool that instantly generates Google Maps JavaScript code from natural language prompts. Unlike ChatGPT, MapScriptor provides **live preview** of your maps with interactive controls for real-time testing and debugging.

### 🎯 Built for the Google Maps Platform Awards Hackathon

Created to solve the friction developers face when building Google Maps applications - no more copy-pasting code snippets and wondering if they work.

## ✨ Key Features

### 🤖 **AI Code Generation**
- Natural language to Google Maps JavaScript code
- Supports routes, markers, shapes, styling, and advanced features
- Powered by OpenAI GPT-3.5-turbo

### 👁️ **Live Preview**
- Instant visualization of generated code
- Real-time map rendering as you iterate
- No need to copy-paste to test functionality

### 🎛️ **Interactive Controls**
- Live sliders for zoom, marker size, shape radius, opacity
- Test different configurations without regenerating code
- Priority system: modifies existing elements first, creates demos as fallback

### 💡 **Smart Suggestions**
- **Auto-complete prompts**: 25+ intelligent suggestions while typing
- **Intent-based follow-ups**: Contextual next steps after code generation
- Location-aware suggestions (NYC, Tokyo, London, etc.)

### 📝 **Documentation Generator**
- AI creates professional README-style docs from your generated code
- Explains functionality, setup, and customization options
- Copy-ready documentation for your projects

### 🔍 **Code History & Diff Viewer**
- Track all generated code versions
- Side-by-side diff comparison
- Understand what changed between iterations

## 🚀 Live Demo

Try it out: [MapScriptor Live](https://your-vercel-url.vercel.app)

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Google Maps API Key
- OpenAI API Key

### Setup
1. Clone the repository:
```bash
git clone https://github.com/aisha-sk/google-maps-ai-copilot.git
cd google-maps-ai-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_MAPS_API_KEY=your_google_maps_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start development server:
```bash
npm run dev
```

## 🌐 Deployment

Deploy to Vercel with environment variables:

```bash
vercel --prod
```

Set these environment variables in Vercel dashboard:
- `VITE_MAPS_API_KEY`
- `VITE_OPENAI_API_KEY`

## 📋 Example Prompts

Try these prompts to see MapScriptor in action:

### Routes
- "Show me a route from New York to Boston"
- "Create driving directions from LAX to Hollywood"
- "Route from Tokyo Station to Tokyo Tower with waypoints"

### Markers
- "Add markers in Tokyo with custom icons"
- "Show restaurant markers in Paris with info windows"
- "Create colored markers across Manhattan"

### Shapes & Areas
- "Draw a circle around Central Park"
- "Create a polygon over downtown San Francisco"
- "Show delivery zones as circles in Chicago"

### Advanced Features
- "Add dark mode styling to a Tokyo map"
- "Show traffic layer in downtown LA"
- "Create a heatmap of popular locations in London"

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Custom CSS with CSS Variables
- **Maps**: Google Maps JavaScript API
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel

## 🎨 Why MapScriptor > ChatGPT?

| Feature | ChatGPT | MapScriptor |
|---------|---------|-------------|
| Code Generation | ✅ | ✅ |
| Live Preview | ❌ | ✅ |
| Interactive Testing | ❌ | ✅ |
| Visual Debugging | ❌ | ✅ |
| Context-Aware Follow-ups | ❌ | ✅ |
| Auto Documentation | ❌ | ✅ |
| Code History | ❌ | ✅ |

## 📱 Responsive Design

MapScriptor works seamlessly across:
- 💻 Desktop (full feature set)
- 📱 Mobile (optimized layout)
- 🖥️ Tablet (adaptive grid)

## 🤝 Contributing

Built by [Aisha Suhail Khan](https://aishask.com) for the Google Maps Platform Awards.

### Links
- **Portfolio**: [aishask.com](https://aishask.com)
- **LinkedIn**: [aishasuhailkhan](https://www.linkedin.com/in/aishasuhailkhan/)
- **GitHub**: [aisha-sk](https://github.com/aisha-sk)

## 📄 License

MIT License - feel free to use this for your own projects!

---

**MapScriptor** - From prompt to production-ready maps in seconds 🚀