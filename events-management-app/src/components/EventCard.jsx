import React from 'react';
import './EventCard.css';

const EventCard = ({ event, isSelected, onClick }) => {
  return (
    <div 
      className={`event-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <h3>{event.title}</h3>
      {event.is_cancelled && (
        <span className='canceled-tag'>
          Canceled
        </span>
      )}
      <div className="event-info">
        <p>
          <span className="icon">🕒</span>
          {event.date_time}
        </p>
        <p>
          <span className="icon">📍</span>
          {event.address}
        </p>
      </div>
    </div>
  );
};

export default EventCard;