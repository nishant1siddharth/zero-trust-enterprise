import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaData, setMfaData] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [showThreatModal, setShowThreatModal] = useState(false);
  const [threatStatus, setThreatStatus] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navigateResource = (path) => {
    navigate(`/resource${path}`);
  };

  const handleSetupMfa = async () => {
    try {
      const res = await api.post('/auth/mfa/setup');
      setMfaData(res.data);
      setShowMfaSetup(true);
      setMfaError('');
    } catch (err) {
      console.error(err);
      alert('Could not initiate MFA setup.');
    }
  };

  const handleEnableMfa = async () => {
    try {
      await api.post('/auth/mfa/enable', { totp_code: mfaCode }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setShowMfaSetup(false);
      alert('MFA successfully enabled! Please logout and login again to apply changes.');
      fetchUser(); // reload user context (though token needs to be refreshed)
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Invalid MFA code. Try again or use 000000.';
      setMfaError(errorMsg);
    }
  };

  const simulateExternalThreat = async () => {
    setThreatStatus('Simulating brute force attack from unknown IP...');
    for(let i=0; i<3; i++) {
      try {
        const formData = new URLSearchParams();
        formData.append('username', 'hacker_bot');
        formData.append('password', 'password123');
        await api.post('/auth/login', formData);
      } catch (err) { console.error(err); }
    }
    setThreatStatus('External threat simulated. 3 Unauthorized attempts logged. Open Security Monitor to view.');
  };

  const simulateInsiderThreat = async () => {
    setThreatStatus('Simulating lateral movement attempt to Admin Console...');
    try {
      await api.get('/admin/system');
      setThreatStatus('Request succeeded (You are an Admin). Login as Employee to see it blocked.');
    } catch (err) {
      console.error(err);
      setThreatStatus('Insider threat blocked! The Policy Engine intercepted the lateral movement attempt. Open Security Monitor to view the DENY log.');
    }
  };

  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Zero Trust Context...</div>;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          🛡️ Zero Trust Enterprise
        </div>
        <div className="navbar-user">
          <span style={{ fontSize: '0.875rem' }}>{user.username}</span>
          <span className="badge badge-role">{user.role}</span>
          {!user.mfa_enabled && (
            <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', borderColor: '#eab308', color: '#eab308' }} onClick={handleSetupMfa}>
              Setup MFA
            </button>
          )}
          <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Enterprise Dashboard</h1>
            <p style={{ marginBottom: 0, color: '#94a3b8' }}>
              Zero Trust Framework secured by <strong>Identity Verification</strong> (MFA/JWT), <strong>Micro-segmentation</strong> (Isolated Zones), and <strong>Encryption</strong> (Data-at-Rest & In-Transit).
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/walkthrough')}>
            🚀 View Guided Tour
          </button>
        </div>

        <div className="grid-cards">
          
          <div className="glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigateResource('/employee')}>
            <h3>👥 Employee Portal</h3>
            <p>Access general employee resources, company news, and personal data.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge">Zone 2</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigateResource('/hr')}>
            <h3>📁 HR Management</h3>
            <p>Manage personnel, access salaries, and process promotions.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge">Zone 3</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigateResource('/finance')}>
            <h3>💰 Finance Service</h3>
            <p>View quarterly reports, initiate wire transfers, and manage budgets.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge">Zone 4</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer' }} onClick={() => navigateResource('/admin')}>
            <h3>⚙️ Admin Console</h3>
            <p>System configuration, database maintenance, and global settings.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge">Zone 5</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', border: '1px solid rgba(139, 92, 246, 0.4)' }} onClick={() => navigateResource('/iam')}>
            <h3 style={{ color: '#8b5cf6' }}>🔐 IAM Policies</h3>
            <p>Identity & Access Management system: View current access control policies.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#c4b5fd' }}>Zone 5</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={() => navigate('/security')}>
            <h3 style={{ color: '#34d399' }}>👁️ Security Monitor</h3>
            <p>View Zero Trust audit logs, failed authentications, and policy decisions.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge badge-success">Zone 6</span></div>
          </div>

          <div className="glass-panel" style={{ cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.4)' }} onClick={() => { setShowThreatModal(true); setThreatStatus(''); }}>
            <h3 style={{ color: '#ef4444' }}>⚠️ Threat Simulator</h3>
            <p>Automate mock attacks to demonstrate Policy Engine effectiveness against threats.</p>
            <div style={{ marginTop: '1rem' }}><span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>Simulation</span></div>
          </div>

        </div>
      </div>

      {showMfaSetup && mfaData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', color: '#eab308' }}>Configure MFA</h2>
            <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>Scan this QR code with Google Authenticator or Authy.</p>
            
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(mfaData.qr_code_url)}&size=200x200`} alt="MFA QR Code" width="200" height="200" />
            </div>

            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Secret Key: <span style={{ fontFamily: 'monospace', color: '#f8fafc' }}>{mfaData.secret}</span>
            </p>

            {mfaError && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{mfaError}</div>}

            <div className="input-group">
              <label>Enter 6-digit Code (or 000000)</label>
              <input type="text" value={mfaCode} onChange={e => setMfaCode(e.target.value)} placeholder="000000" maxLength={6} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowMfaSetup(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#eab308', borderColor: '#eab308', color: '#000' }} onClick={handleEnableMfa}>Verify & Enable</button>
            </div>
          </div>
        </div>
      )}

      {showThreatModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: '#ef4444' }}>Threat Simulator</h2>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setShowThreatModal(false)}>Close</button>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: '#cbd5e1' }}>
              Test the effectiveness of the Zero Trust architecture by launching mock attacks. 
              The Policy Engine and Identity Gateway will intercept these attempts and log them.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-outline" style={{ borderColor: '#f97316', color: '#f97316', padding: '1rem' }} onClick={simulateExternalThreat}>
                <strong>🔥 Simulate External Threat</strong>
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Automates a brute-force credential stuffing attack against the Identity Gateway.</div>
              </button>

              <button className="btn btn-outline" style={{ borderColor: '#a855f7', color: '#a855f7', padding: '1rem' }} onClick={simulateInsiderThreat}>
                <strong>🕵️ Simulate Insider Threat</strong>
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Attempts lateral movement from your current account to the highly restricted Admin Zone.</div>
              </button>
            </div>

            {threatStatus && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', fontSize: '0.85rem', color: '#34d399', border: '1px solid #10b981' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#f8fafc' }}>Simulation Output:</strong>
                {threatStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
