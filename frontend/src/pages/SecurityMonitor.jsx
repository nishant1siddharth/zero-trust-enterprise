import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SecurityMonitor() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const statsRes = await api.get('/audit/stats');
        setStats(statsRes.data);
        
        const logsRes = await api.get('/audit/logs?limit=50');
        setLogs(logsRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch audit logs. Ensure you have the SECURITY_ANALYST role.');
      }
    };
    fetchAuditData();
  }, []);

  if (error) {
    return (
      <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ border: '1px solid var(--danger)', display: 'inline-block' }}>
          <h2 style={{ color: 'var(--danger)' }}>🛑 Access Denied</h2>
          <p>{error}</p>
          <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          ⬅️ Back to Dashboard
        </div>
        <div>
          <span className="badge badge-success">Live Monitoring Active</span>
        </div>
      </nav>

      <div className="container animate-fade-in">
        <h1 style={{ marginBottom: '0.5rem' }}>Security Monitoring Dashboard</h1>
        <p>Real-time audit log analysis and Zero Trust policy decisions.</p>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.total_requests}</div>
              <div style={{ color: 'var(--text-muted)' }}>Total Audited Requests</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid var(--success)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.allowed_requests}</div>
              <div style={{ color: 'var(--text-muted)' }}>Allowed Requests</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid var(--danger)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{stats.denied_requests}</div>
              <div style={{ color: 'var(--text-muted)' }}>Denied Requests</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '2px solid #f59e0b' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.failed_logins}</div>
              <div style={{ color: 'var(--text-muted)' }}>Failed Logins</div>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Recent Audit Logs</h3>
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)' }}>
                  <th style={{ padding: '1rem' }}>Timestamp</th>
                  <th style={{ padding: '1rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                  <th style={{ padding: '1rem' }}>Resource</th>
                  <th style={{ padding: '1rem' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td style={{ padding: '1rem' }}>{log.user_id}</td>
                    <td style={{ padding: '1rem' }}><span className="badge badge-role">{log.role}</span></td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{log.action}</td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{log.resource}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={log.decision === 'ALLOW' ? 'badge badge-success' : 'badge badge-danger'}>
                        {log.decision}
                      </span>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
