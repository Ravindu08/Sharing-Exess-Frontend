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

  const RequestCard = ({ r }) => (
    <div className="dashboard-card" style={{ background: '#fff' }}>
      <div className="food-header">
        <strong className="food-name">{r.listing_title || r.food_name || 'Request'}{r.listing_id ? ` (#${r.listing_id})` : ''}</strong>
        <span className="quantity-badge">{r.quantity}</span>
        <span className={`status-badge`} style={{marginLeft: 8, color:'#fff', background: r.status==='accepted' ? '#28a745' : r.status==='declined' ? '#dc3545' : '#6c757d', borderRadius:6, padding:'4px 10px', fontWeight:700}}>
          {String(r.status||'pending').charAt(0).toUpperCase()+String(r.status||'pending').slice(1)}
        </span>
      </div>
      <div className="food-details">
        <div className="detail-item"><span className="detail-label">Recipient:</span> <span className="detail-value">{r.recipient_name} (#{r.recipient_id})</span></div>
        {r.needed_by && (<div className="detail-item"><span className="detail-label">Needed by:</span> <span className="detail-value">{r.needed_by}</span></div>)}
        {r.location && (<div className="detail-item"><span className="detail-label">Location:</span> <span className="detail-value">{r.location}</span></div>)}
        {r.notes && (<div className="detail-item"><span className="detail-label">Notes:</span> <span className="detail-value">{r.notes}</span></div>)}
        <div className="detail-item"><span className="detail-label">Requested:</span> <span className="detail-value">{new Date(r.created_at).toLocaleDateString()}</span></div>
      </div>
      <div className="request-actions">
        <button onClick={() => { const v = prompt('Set status (pending, accepted, declined):', r.status || 'pending'); if (!v) return; updateRequest(r.id, { status: v }); }} className="update-btn">Set Status</button>
        <button onClick={() => { const v = prompt('Set quantity:', r.quantity); if (v===null) return; const n = parseInt(v,10); if (isNaN(n)) return alert('Invalid number'); updateRequest(r.id, { quantity: n }); }} className="update-btn">Set Qty</button>
        <button onClick={() => { const v = prompt('Set notes:', r.notes || ''); if (v===null) return; updateRequest(r.id, { notes: v }); }} className="update-btn">Set Notes</button>
        <button onClick={() => deleteRequest(r.id)} className="delete-btn" style={{background:'#dc3545', color:'#fff'}}>Delete</button>
      </div>
    </div>
  );

  const ListingCard = ({ l }) => (
    <div className="dashboard-card" style={{ background: '#fff' }}>
      <div className="food-header">
        <strong className="food-name">{l.title}</strong>
        <span className="quantity-badge">{l.quantity}</span>
        <span className="status-badge" style={{marginLeft:8, color:'#fff', background: l.status==='delivered' ? '#28a745' : l.status==='inactive' ? '#6c757d' : '#007bff', borderRadius:6, padding:'4px 10px', fontWeight:700}}>
          {String(l.status||'active').charAt(0).toUpperCase()+String(l.status||'active').slice(1)}
        </span>
      </div>
      <div className="food-details">
        {l.description && (<div className="detail-item"><span className="detail-label">Description:</span> <span className="detail-value">{l.description}</span></div>)}
        {l.location && (<div className="detail-item"><span className="detail-label">Location:</span> <span className="detail-value">{l.location}</span></div>)}
        {l.expiry_date && (<div className="detail-item"><span className="detail-label">Expiry:</span> <span className="detail-value">{l.expiry_date}</span></div>)}
        <div className="detail-item"><span className="detail-label">Listed:</span> <span className="detail-value">{new Date(l.created_at).toLocaleDateString()}</span></div>
      </div>
      <div className="request-actions">
        <button onClick={() => { const v = prompt('Set status (active, inactive, delivered):', l.status || 'active'); if (!v) return; updateListing(l.id, { status: v }); }} className="update-btn">Set Status</button>
        <button onClick={() => { const v = prompt('Set quantity:', l.quantity); if (v===null) return; updateListing(l.id, { quantity: v }); }} className="update-btn">Set Qty</button>
        <button onClick={() => { const v = prompt('Set title:', l.title || ''); if (v===null) return; updateListing(l.id, { title: v }); }} className="update-btn">Set Title</button>
        <button onClick={() => { const v = prompt('Set description:', l.description || ''); if (v===null) return; updateListing(l.id, { description: v }); }} className="update-btn">Set Desc</button>
        <button onClick={() => deleteListing(l.id)} className="delete-btn" style={{background:'#dc3545', color:'#fff'}}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2>Officer Dashboard</h2>
      <div className="dashboard-header">
        <p>Manage recipient requests and donor listings</p>
        <div>
          <button onClick={() => setTab('requests')} className="refresh-btn" style={{marginRight:8}} disabled={tab==='requests'}>Requests</button>
          <button onClick={() => setTab('listings')} className="refresh-btn" disabled={tab==='listings'}>Listings</button>
          <button onClick={fetchData} className="refresh-btn" style={{ marginLeft: 8 }}>Refresh</button>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {tab === 'requests' && (
        <div className="dashboard-listings">
          {requests.map(r => <RequestCard key={r.id} r={r} />)}
          {requests.length === 0 && !loading && (
            <div className="no-requests"><p>No requests</p></div>
          )}
        </div>
      )}

      {tab === 'listings' && (
        <div className="dashboard-listings">
          {listings.map(l => <ListingCard key={l.id} l={l} />)}
          {listings.length === 0 && !loading && (
            <div className="no-requests"><p>No listings</p></div>
          )}
        </div>
      )}
    </div>
  );
}
