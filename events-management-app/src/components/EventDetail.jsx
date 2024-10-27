import React, {useState, useEffect, useCallback} from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import './EventDetail.css';

const EventDetail = ({ eventID }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWebSocketMessage = useCallback((message) => {
    if (!event) return;

    const type = message.type;
    const data = message.data;

    switch (type) {
      case 'event_canceled':
        if (data.id === eventID) {
          setEvent(prev => ({ ...prev, is_canceled: true }));
        }
        break;

      case 'joined_event':
        if (data.event_id === eventID) {
          setEvent(prev => {
            const updatedParticipants = [...(prev.participants || []), {
              id: data.participant.id,
              name: data.participant.name
            }];
            return { ...prev, participants: updatedParticipants };
          });
        }
        break;

      case 'left_event':
        if (data.event_id === eventID) {
          setEvent(prev => {
            const updatedParticipants = (prev.participants || []).filter(
              participant => participant.id !== data.participant.id
            );
            return { ...prev, participants: updatedParticipants };
          });
        }
        break;
    }
  }, [eventID, event]);

  useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    if (!eventID) return;

    const fetchEventDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8000/events/${eventID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventID]);

  if (!eventID) return null;
  if (loading) return <div className="event-detail loading">Loading...</div>;
  if (error) return <div className="event-detail error">Error: {error}</div>;
  if (!event) return null;

  return (
    <div className="event-detail">
      <h2>{event.title}</h2>
      {event.is_cancelled && (
        <span className='canceled-tag'>
          Canceled
        </span>
      )}
      <div className="detail-content">
        <div className="detail-item">
          <h3>Organizer</h3>
          <p>{event.organizer.name}</p>
        </div>
        <div className="detail-item">
          <h3>Date and Time</h3>
          <p>{event.date_time}</p>
        </div>
        <div className="detail-item">
          <h3>Duration</h3>
          <p>{event.duration}</p>
        </div>
        <div className="detail-item">
          <h3>Location</h3>
          <p>{event.address}</p>
        </div>
        <div className="detail-item">
          <h3>Participants ({event.participants.length})</h3>
          <ul>
            {event.participants.map(participant => (
              <li key={participant.id}>{participant.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;