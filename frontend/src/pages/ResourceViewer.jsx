import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const SERVICE_MAP = {
  employee: { title: 'Employee Portal', endpoint: '/employee/portal', color: '#0ea5e9' },
  hr: { title: 'HR Management', endpoint: '/hr/data', color: '#ec4899' },
  finance: { title: 'Finance Service', endpoint: '/finance/reports', color: '#eab308' },
  admin: { title: 'Admin Console', endpoint: '/admin/system', color: '#8b5cf6' },
  iam: { title: 'Identity & Access Management (IAM)', endpoint: '/admin/iam-policies', color: '#c4b5fd' }
};

export default function ResourceViewer() {
  const { service } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const resourceInfo = SERVICE_MAP[service] || { title: 'Unknown Service', endpoint: `/${service}/`, color: '#64748b' };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(resourceInfo.endpoint);
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError(err.response.data.detail || 'Zero Trust Policy Denied');
        } else {
          setError(err.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [service, resourceInfo.endpoint]);

  const renderServiceMock = () => {
    if (service === 'employee') {
      return (
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Company Announcements</h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{data.data || 'General employee announcements'}</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Paystub</button>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0ea5e9' }}>📌 Upcoming Maintenance</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1' }}>The VPN will be offline on Saturday from 2AM to 4AM EST for routine Zero Trust upgrades.</p>
          </div>
        </div>
      );
    }
    if (service === 'hr') {
      return (
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>Employee Directory</h3>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#ec4899', borderColor: '#ec4899' }} onClick={async () => {
              try {
                const res = await api.post('/hr/data');
                alert(res.data.message);
              } catch (err) {
                alert(err.response?.data?.detail || 'Action Denied');
              }
            }}>+ Add Employee</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '0.5rem' }}>ID</th>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th style={{ padding: '0.5rem' }}>Department</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.5rem' }}>EMP-001</td><td style={{ padding: '0.5rem' }}>Alice Smith</td><td style={{ padding: '0.5rem' }}>Engineering</td><td style={{ padding: '0.5rem', color: '#10b981' }}>Active</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.5rem' }}>EMP-002</td><td style={{ padding: '0.5rem' }}>Bob Jones</td><td style={{ padding: '0.5rem' }}>Marketing</td><td style={{ padding: '0.5rem', color: '#10b981' }}>Active</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#ec4899' }}>Secure Data: {data.salaries || 'Salaries loaded'}</p>
        </div>
      );
    }
    if (service === 'finance') {
      return (
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Financial Overview - FY26</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#fde047', textTransform: 'uppercase', letterSpacing: '1px' }}>Q3 Revenue</p>
              <h2 style={{ margin: '0.5rem 0 0 0', color: '#f8fafc' }}>{data.Q3_Revenue || '$1,250,000'}</h2>
            </div>
            <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '1px' }}>YTD Expenses</p>
              <h2 style={{ margin: '0.5rem 0 0 0', color: '#f8fafc' }}>$840,000</h2>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', background: '#eab308', borderColor: '#eab308', color: '#000' }}>Initiate Wire Transfer</button>
        </div>
      );
    }
    if (service === 'admin') {
      return (
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>System Diagnostics</h3>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{data.status || 'OPERATIONAL'}</span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#8b5cf6' }}>
            <div>&gt; Checking Policy Engine Nodes... OK (3/3)</div>
            <div>&gt; Verifying Audit Logger Queue... OK (0 pending)</div>
            <div>&gt; Identity Provider Sync... DELAYED (14ms ping)</div>
            <div>&gt; PEP Middleware Active... OK</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" style={{ flex: 1, borderColor: '#8b5cf6', color: '#8b5cf6' }} onClick={async () => {
              try {
                const res = await api.post('/admin/restart');
                alert(res.data.message);
              } catch (err) {
                alert(err.response?.data?.detail || 'Action Denied');
              }
            }}>Restart Services</button>
            <button className="btn btn-outline" style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={async () => {
              try {
                const res = await api.post('/admin/lockdown');
                alert(res.data.message);
              } catch (err) {
                alert(err.response?.data?.detail || 'Action Denied');
              }
            }}>Emergency Lockdown</button>
          </div>
        </div>
      );
    }
    if (service === 'iam') {
      const policies = data?.policies || [];
      return (
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#f8fafc' }}>Access Control Policies</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>These rules are evaluated by the Policy Decision Point (PDP) for every request.</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', color: '#c4b5fd' }}>
                <th style={{ padding: '0.5rem' }}>Role</th>
                <th style={{ padding: '0.5rem' }}>Resource</th>
                <th style={{ padding: '0.5rem' }}>Action</th>
                <th style={{ padding: '0.5rem' }}>Decision</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{p.role}</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#93c5fd' }}>{p.resource}</td>
                  <td style={{ padding: '0.5rem' }}>{p.action}</td>
                  <td style={{ padding: '0.5rem', color: p.decision === 'ALLOW' ? '#34d399' : '#f87171' }}>{p.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    // Fallback JSON render
    return (
      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.875rem', overflow: 'auto' }}>
        <pre style={{ margin: 0, color: '#a7f3d0' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          ⬅️ Back to Dashboard
        </div>
      </nav>

      <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        
        {loading ? (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ color: '#0ea5e9', marginBottom: '1rem' }}>Evaluating Zero Trust Policy...</div>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(14, 165, 233, 0.3)', borderTopColor: '#0ea5e9', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ border: '1px solid var(--danger)', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.2)', width: '100%', maxWidth: '600px' }}>
            <h2 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🛑 Access Denied
            </h2>
            <p style={{ marginTop: '1rem', color: '#f87171' }}>{error}</p>
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <div><strong style={{ color: '#94a3b8' }}>Resource:</strong> {resourceInfo.endpoint}</div>
              <div><strong style={{ color: '#94a3b8' }}>Enforcement Point:</strong> PEP Middleware</div>
              <div><strong style={{ color: '#94a3b8' }}>Decision:</strong> <span style={{ color: 'var(--danger)' }}>DENY</span></div>
            </div>
            <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => navigate('/dashboard')}>
              Return to Safety
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ border: `1px solid ${resourceInfo.color}`, boxShadow: `0 8px 30px ${resourceInfo.color}20`, width: '100%', maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderBottom: `1px solid ${resourceInfo.color}40`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>{resourceInfo.title}</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span title="Identity Verification" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>✅ Identity Verified</span>
                <span title="Micro-segmentation" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>✅ Micro-Segmented</span>
                <span title="Encryption" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>🔒 Encrypted</span>
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div style={{ padding: '1.5rem' }}>
              {renderServiceMock()}
            </div>

            {/* Footer / Raw Data toggle */}
            <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>Endpoint: {resourceInfo.endpoint}</span>
              <span>Session: Active (MFA Evaluated)</span>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
