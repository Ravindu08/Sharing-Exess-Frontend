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
    // Format date as YYYY-MM-DD in local timezone (not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDateString = `${year}-${month}-${day}`;
    setSelectedEvents(events.filter(e => e.date === localDateString));
  }, [date, events]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e9f5ec 100%)', padding: 40 }}>
      <h2 style={{ textAlign: 'center', color: '#28a745', fontWeight: 900, fontSize: '2.5rem', marginBottom: 32 }}>Calendar</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Calendar
          onChange={setDate}
          value={date}
      
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
                <li key={idx} style={{ color: '#28a745', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>
                  {event.title} ({event.location})
                  <br />
                  <span style={{
  color:
    event.status === 'picked_up' ? '#007bff' :
    event.status === 'delivering' ? '#ff9800' :
    event.status === 'delivered' ? '#28a745' : '#555',
  fontWeight: 600,
  fontSize: '0.95rem',
  letterSpacing: '0.5px'
}}>
  Status: {event.status === 'picked_up' ? 'Quality Checked' : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
</span>
                  {/* Officer/Admin status update UI */}
                  {(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const allowedEmails = ['admin@sharingexcess.com', 'officer@sharingexcess.com'];
  if (user && allowedEmails.includes(user.email)) {
    return (
      <div style={{ display: 'inline-block', marginLeft: 10 }}>
        {['picked_up', 'delivering', 'delivered'].map(option => (
          <label key={option} style={{ marginRight: 12, fontWeight: 400, color: '#333', fontSize: '0.95rem' }}>
            <input
              type="radio"
              name={`status-${event.id}`}
              value={option}
              checked={event.status === option}
              onChange={async (e) => {
                const newStatus = e.target.value;
                await fetch('http://localhost/Sharing%20Excess/backend/update_delivery_status.php', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: event.id, status: newStatus })
                });
                // Refresh events
                fetch('http://localhost/Sharing%20Excess/backend/get_calendar_events.php')
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) setEvents(data.events);
                  });
              }}
            />
            {option === 'picked_up' && 'Quality Checked'}
            {option === 'delivering' && 'Delivering'}
            {option === 'delivered' && 'Delivered'}
          </label>
        ))}
      </div>
    );
  }
  return null;
})()}

                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage; 