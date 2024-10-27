import React from 'react';
import EventsList from './components/EventsList';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>Events Management</h1>
      </header>
      <main>
        <EventsList />
      </main>
    </div>
  );
};

export default App;