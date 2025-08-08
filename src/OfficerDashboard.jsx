import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost/Sharing%20Excess/backend';

export default function OfficerDashboard() {
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [r1, r2] = await Promise.all([
        fetch(`${API_BASE}/officer_list_requests.php`).then(r => r.json()),
        fetch(`${API_BASE}/officer_list_listings.php`).then(r => r.json()),
      ]);
      if (r1.success) setRequests(r1.requests || []); else setError(r1.message || 'Failed to load requests');
      if (r2.success) setListings(r2.listings || []); else setError(prev => prev || r2.message || 'Failed to load listings');
    } catch (e) {
      setError('Network error while loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateRequest = async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/officer_update_request.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, updates })
      }).then(r => r.json());
      if (!res.success) return setError(res.message || 'Update failed');
      fetchData();
    } catch {
      setError('Network error');
    } finally { setLoading(false); }
  };

  const deleteRequest = async (id) => {
    if (!confirm('Delete this request?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/officer_delete_request.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id })
      }).then(r => r.json());
      if (!res.success) return setError(res.message || 'Delete failed');
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const updateListing = async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/officer_update_listing.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id, updates })
      }).then(r => r.json());
      if (!res.success) return setError(res.message || 'Update failed');
      fetchData();
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/officer_delete_listing.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id })
      }).then(r => r.json());
      if (!res.success) return setError(res.message || 'Delete failed');
      setListings(ls => ls.filter(l => l.id !== id));
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  const RequestRow = ({ r }) => (
    <tr>
      <td>{r.id}</td>
      <td>{r.listing_title} (#{r.listing_id})</td>
      <td>{r.recipient_name} (#{r.recipient_id})</td>
      <td>{r.status}</td>
      <td>{r.quantity}</td>
      <td>
        <button onClick={() => {
          const v = prompt('Set status (pending, accepted, declined):', r.status || 'pending');
          if (!v) return; updateRequest(r.id, { status: v });
        }}>Set Status</button>
        <button onClick={() => {
          const v = prompt('Set quantity:', r.quantity);
          if (v === null) return; const n = parseInt(v, 10); if (isNaN(n)) return alert('Invalid number');
          updateRequest(r.id, { quantity: n });
        }} style={{ marginLeft: 6 }}>Set Qty</button>
        <button onClick={() => {
          const v = prompt('Set notes:', r.notes || '');
          if (v === null) return; updateRequest(r.id, { notes: v });
        }} style={{ marginLeft: 6 }}>Set Notes</button>
        <button onClick={() => deleteRequest(r.id)} style={{ marginLeft: 6, color: 'red' }}>Delete</button>
      </td>
    </tr>
  );

  const ListingRow = ({ l }) => (
    <tr>
      <td>{l.id}</td>
      <td>{l.title}</td>
      <td>{l.quantity}</td>
      <td>{l.status}</td>
      <td>
        <button onClick={() => {
          const v = prompt('Set status (active, inactive, delivered):', l.status || 'active');
          if (!v) return; updateListing(l.id, { status: v });
        }}>Set Status</button>
        <button onClick={() => {
          const v = prompt('Set quantity:', l.quantity);
          if (v === null) return; const n = parseInt(v, 10); if (isNaN(n)) return alert('Invalid number');
          updateListing(l.id, { quantity: n });
        }} style={{ marginLeft: 6 }}>Set Qty</button>
        <button onClick={() => {
          const v = prompt('Set title:', l.title || '');
          if (v === null) return; updateListing(l.id, { title: v });
        }} style={{ marginLeft: 6 }}>Set Title</button>
        <button onClick={() => {
          const v = prompt('Set description:', l.description || '');
          if (v === null) return; updateListing(l.id, { description: v });
        }} style={{ marginLeft: 6 }}>Set Desc</button>
        <button onClick={() => deleteListing(l.id)} style={{ marginLeft: 6, color: 'red' }}>Delete</button>
      </td>
    </tr>
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Officer Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setTab('requests')} disabled={tab==='requests'}>Requests</button>
        <button onClick={() => setTab('listings')} disabled={tab==='listings'} style={{ marginLeft: 8 }}>Listings</button>
        <button onClick={fetchData} style={{ marginLeft: 8 }}>Refresh</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {loading && <div>Loading…</div>}

      {tab === 'requests' && (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th><th>Listing</th><th>Recipient</th><th>Status</th><th>Qty</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => <RequestRow key={r.id} r={r} />)}
            {requests.length === 0 && !loading && <tr><td colSpan="6">No requests</td></tr>}
          </tbody>
        </table>
      )}

      {tab === 'listings' && (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Qty</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => <ListingRow key={l.id} l={l} />)}
            {listings.length === 0 && !loading && <tr><td colSpan="5">No listings</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
