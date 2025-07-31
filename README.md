# Google Maps AI Copilot

AI-powered code generation for Google Maps integration.

## Prerequisites

- Node.js
- Vercel CLI

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys
2. Run `npm install`

## Development & Deploy

```bash
npm run dev    # uses vercel dev
vercel deploy
```

## Usage

POST `/api/generate` with JSON payload:

```json
{ "prompt": "Create a Google Maps marker" }
```

Returns:

```json
{ "code": "<generated JS snippet>" }
```
