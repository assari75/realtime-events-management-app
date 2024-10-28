import React from 'react';
import EventsList from './components/EventsList';
import { WebSocketProvider } from './services/websocket';
import './App.css';

const App = () => {
  return (
    <WebSocketProvider>
      <div className="app">
        <header>
          <h1>Events Management</h1>
        </header>
        <main>
          <EventsList />
        </main>
      </div>
    </WebSocketProvider>
  );
};

export default App;