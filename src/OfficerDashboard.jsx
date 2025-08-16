import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const API_BASE = 'http://localhost/Sharing%20Excess/backend';

export default function OfficerDashboard() {
  const [tab, setTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [moneyDonations, setMoneyDonations] = useState([]);

  // Fetch all data for stats
  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reqRes, listRes, userRes, moneyRes] = await Promise.all([
        fetch(`${API_BASE}/officer_list_requests.php`).then(r => r.json()),
        fetch(`${API_BASE}/officer_list_listings.php`).then(r => r.json()),
        fetch(`${API_BASE}/officer_list_users.php`).then(r => r.json()),
        fetch(`${API_BASE}/officer_list_money_donations.php`).then(r => r.json()),
      ]);
      if (reqRes.success) setRequests(reqRes.requests || []); else setError(reqRes.message || 'Failed to load requests');
      if (listRes.success) setListings(listRes.listings || []); else setError(prev => prev || listRes.message || 'Failed to load listings');
      if (userRes.success) setUsers(userRes.users || []); else setError(prev => prev || userRes.message || 'Failed to load users');
      if (moneyRes.success) setMoneyDonations(moneyRes.donations || []); else setError(prev => prev || moneyRes.message || 'Failed to load money donations');
    } catch (e) {
      setError('Network error while loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const updateRequest = async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/officer_update_request.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, updates })
      }).then(r => r.json());
      if (!res.success) return setError(res.message || 'Update failed');
      fetchAllData();
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
      fetchAllData();
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

  // --- Stats Calculation ---
  // Most requested food items (top 5)
  const foodCount = {};
  requests.forEach(r => {
    const name = r.food_name || r.listing_title || 'Unknown';
    foodCount[name] = (foodCount[name] || 0) + 1;
  });
  const sortedFoods = Object.entries(foodCount).sort((a, b) => b[1] - a[1]);
  const topFoods = sortedFoods.slice(0, 5);
  const foodLabels = topFoods.map(([name]) => name);
  const foodData = topFoods.map(([, count]) => count);

  // Distributions over time (by month)
  const distByMonth = {};
  requests.filter(r => r.status === 'accepted').forEach(r => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    distByMonth[key] = (distByMonth[key] || 0) + 1;
  });
  const distLabels = Object.keys(distByMonth).sort();
  const distData = distLabels.map(m => distByMonth[m]);

  // Donors & Recipients count
  const donorCount = users.filter(u => u.role === 'donor').length;
  const recipientCount = users.filter(u => u.role === 'recipient').length;

  // Contributions breakdown (food items and money donations by month)
  const contribByMonth = {};
  
  // Add food donations (count items)
  listings.forEach(l => {
    const d = new Date(l.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!contribByMonth[key]) contribByMonth[key] = { food: 0, money: 0 };
    contribByMonth[key].food += 1; // Count each item as 1
  });
  
  // Add money donations (count donations)
  moneyDonations.forEach(m => {
    const d = new Date(m.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!contribByMonth[key]) contribByMonth[key] = { food: 0, money: 0 };
    contribByMonth[key].money += 1; // Count each donation as 1
  });
  
  const contribLabels = Object.keys(contribByMonth).sort();
  const foodContribData = contribLabels.map(m => contribByMonth[m].food);
  const monetaryContribData = contribLabels.map(m => contribByMonth[m].money);

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
          <button onClick={fetchAllData} className="refresh-btn" style={{ marginLeft: 8 }}>Refresh</button>
          <button onClick={() => setShowStats(s => !s)} className="refresh-btn" style={{ marginLeft: 8, background: '#ffc107', color: '#222' }}>Stats</button>
        </div>
      </div>
      {showDonate && (
        <div style={{ background: '#fff', border: '2px solid #28a745', borderRadius: 12, padding: 24, margin: '24px 0', maxWidth: 400 }}>
          <h3 style={{ color: '#28a745', marginBottom: 12 }}>Bank Account Details</h3>
          <div style={{ fontSize: 18, color: '#222', marginBottom: 8 }}><b>Bank:</b> ABC Bank</div>
          <div style={{ fontSize: 18, color: '#222', marginBottom: 8 }}><b>Account Number:</b> 123456789</div>
          <div style={{ fontSize: 18, color: '#222', marginBottom: 8 }}><b>Account Name:</b> Sharing Excess</div>
          <div style={{ fontSize: 16, color: '#555', marginTop: 12 }}>Please use your name as reference when donating.</div>
        </div>
      )}
      {showStats && (
        <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>Platform Statistics</h3>
          
          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ 
              background: '#007bff', 
              color: '#fff', 
              padding: '16px 24px', 
              borderRadius: 8, 
              flex: 1, 
              minWidth: 200,
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Food Donations</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{listings.length}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Items</div>
            </div>
            <div style={{ 
              background: '#28a745', 
              color: '#fff', 
              padding: '16px 24px', 
              borderRadius: 8, 
              flex: 1, 
              minWidth: 200,
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Money Donations</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{moneyDonations.length}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Donors</div>
            </div>
            <div style={{ 
              background: '#ffc107', 
              color: '#222', 
              padding: '16px 24px', 
              borderRadius: 8, 
              flex: 1, 
              minWidth: 200,
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Total Money Raised</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                Rs {moneyDonations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>LKR</div>
            </div>
            <div style={{ 
              background: '#17a2b8', 
              color: '#fff', 
              padding: '16px 24px', 
              borderRadius: 8, 
              flex: 1, 
              minWidth: 200,
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Unique Food Donors</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {new Set(listings.map(l => l.donor_id)).size}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>People</div>
            </div>
            <div style={{ 
              background: '#6f42c1', 
              color: '#fff', 
              padding: '16px 24px', 
              borderRadius: 8, 
              flex: 1, 
              minWidth: 200,
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Unique Money Donors</h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {new Set(moneyDonations.map(d => d.email)).size}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>People</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {/* Most Requested Food Items (Bar) */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <h4>Most Requested Food Items</h4>
              <Bar
                data={{
                  labels: foodLabels,
                  datasets: [{
                    label: 'Requests',
                    data: foodData,
                    backgroundColor: '#007bff',
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
                height={200}
              />
            </div>
            {/* Distributions Over Time (Line) */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <h4>Distributions Over Time</h4>
              <Line
                data={{
                  labels: distLabels,
                  datasets: [{
                    label: 'Distributions',
                    data: distData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40,167,69,0.1)',
                    fill: true,
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
                height={200}
              />
            </div>
            {/* Donors & Recipients (Pie) */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <h4>Registered Donors & Recipients</h4>
              <Pie
                data={{
                  labels: ['Donors', 'Recipients'],
                  datasets: [{
                    data: [donorCount, recipientCount],
                    backgroundColor: ['#ffc107', '#17a2b8'],
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                height={200}
              />
            </div>
          </div>
          {/* Contributions (Stacked Bar) */}
          <div style={{ marginTop: 32 }}>
            <h4>Contributions Breakdown</h4>
            <Bar
              data={{
                labels: contribLabels,
                datasets: [
                  {
                    label: 'Food Items',
                    data: foodContribData,
                    backgroundColor: '#007bff',
                  },
                  {
                    label: 'Money Donations',
                    data: monetaryContribData,
                    backgroundColor: '#28a745',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
              height={200}
            />
          </div>
        </div>
      )}
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
