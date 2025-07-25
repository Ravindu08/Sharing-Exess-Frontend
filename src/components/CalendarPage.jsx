import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    // Fetch accepted requests/donations from backend
    fetch('http://localhost/Sharing%20Excess/backend/get_calendar_events.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      });
  }, []);

  useEffect(() => {
    const day = date.toISOString().split('T')[0];
    setSelectedEvents(events.filter(e => e.date === day));
  }, [date, events]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ec 100%)', padding: 40 }}>
      <h2 style={{ textAlign: 'center', color: '#28a745', fontWeight: 900, fontSize: '2.5rem', marginBottom: 32 }}>Calendar</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Calendar
          onChange={setDate}
          value={date}
          calendarType="US"
        />
        <div style={{ marginTop: 32, width: '100%', maxWidth: 500 }}>
          <h3 style={{ color: '#222', fontWeight: 700, fontSize: '1.3rem', marginBottom: 12 }}>
            Events on {date.toLocaleDateString()}
          </h3>
          {selectedEvents.length === 0 ? (
            <p style={{ color: '#888', fontSize: '1rem' }}>No events for this date.</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {selectedEvents.map((event, idx) => (
                <li key={idx} style={{ color: '#28a745', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>{event.title} ({event.location})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage; 