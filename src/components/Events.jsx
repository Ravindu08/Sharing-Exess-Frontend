import React from 'react';

// NOTE: Replace the "src" below with your public Google Calendar embed link
// Example format:
// https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FColombo&showTz=0&showPrint=0&src=YOUR_CALENDAR_ID&color=%23039BE5
// If you don't have a calendar yet, share a Google Calendar publicly and copy the Embed URL.

const GOOGLE_CALENDAR_EMBED_SRC =
  'https://calendar.google.com/calendar/embed?height=650&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FColombo&showTitle=0&showPrint=0&showTabs=1&showCalendars=0&mode=MONTH&src=YOUR_CALENDAR_ID';

function Events() {
  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{
          color: '#28a745',
          fontWeight: 900,
          fontSize: '2.2rem',
          textAlign: 'center',
          marginBottom: 12,
          fontFamily: "'Montserrat', sans-serif",
        }}>
          Pop-up Food Distribution Calendar
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#0a0a0a',
          maxWidth: 900,
          margin: '0 auto 18px',
          lineHeight: 1.5,
        }}>
          All events are free and open to the public. Food is first come, first serve.
          Note: Events may occasionally be canceled due to weather — please check on the day of.
        </p>

        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
          padding: 12,
        }}>
          <div style={{ position: 'relative', paddingTop: '0' }}>
            <iframe
              title="Google Calendar"
              src={GOOGLE_CALENDAR_EMBED_SRC}
              style={{ border: 0, width: '100%', height: 650, borderRadius: 12 }}
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <a
            href="https://calendar.google.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#28a745', fontWeight: 700, textDecoration: 'none' }}
          >
            Add to Google Calendar →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Events;
