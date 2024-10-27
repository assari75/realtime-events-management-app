# Events Management UI

A real-time event management frontend built with React.

## Features

- Real-time event updates using WebSocket connection
- List and detail view of events

## Installation

1. Clone the repository:
```bash
git clone https://github.com/assari75/realtime-events-management-app.git
cd realtime-events-management-app
```

2. Install dependencies:
```bash
yarn install
```

## Running the Application

1. Start the development server:
```bash
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL = http://localhost:8000
VITE_WS_URL = ws://localhost:8000
```
