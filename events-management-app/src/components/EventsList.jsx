import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import EventCard from './EventCard';
import EventDetail from './EventDetail';
import './EventsList.css';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventID, setSelectedEventID] = useState(null);

  const handleWebSocketMessage = useCallback((message) => {
    const type = message.type;
    const data = message.data;
    switch (type) {
      case 'event_created':
        setEvents(prevEvents => {
          const eventIndex = prevEvents.findIndex(e => e.id === data.id);
          if (eventIndex >= 0) {
            const newEvents = [...prevEvents];
            newEvents[eventIndex] = data;
            return newEvents;
          }
          return [...prevEvents, data];
        });
        break;
      case 'event_canceled':
        setEvents(prevEvents => {
          return prevEvents.map(e => {
            if (e.id === data.id) {
              return { ...e, is_cancelled: true };
            }
            return e;
          });
        });
        break;
      default:
        break;
    }
  }, []);

  useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    fetch('http://localhost:8000/events/')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div className="events-container">
      <div className="events-list">
        <h2>Events</h2>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isSelected={selectedEventID === event.id}
            onClick={() => setSelectedEventID(event.id)}
          />
        ))}
      </div>

      <EventDetail
        eventID={selectedEventID}
      />
    </div>
  );
};

export default EventsList;