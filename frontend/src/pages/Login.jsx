import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      if (needsMfa && totpCode) {
        formData.append('totp_code', totpCode);
      }

      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail === "MFA challenge required") {
        setNeedsMfa(true);
      } else if (err.response) {
        setError(err.response.data.detail || `Server Error: ${err.response.status}`);
      } else {
        setError(`Network Error: ${err.message}. Backend might be offline or CORS failed.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Zero Trust Gateway</h2>
        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '2rem' }}>Authenticate to access enterprise resources</p>
        
        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={needsMfa}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={needsMfa}
              required 
            />
          </div>
          
          {needsMfa && (
            <div className="input-group animate-fade-in">
              <label>Authenticator Code (MFA)</label>
              <input 
                type="text" 
                value={totpCode} 
                onChange={(e) => setTotpCode(e.target.value)} 
                placeholder="000000"
                maxLength={6}
                required 
                autoFocus
              />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Verifying...' : (needsMfa ? 'Verify MFA' : 'Authenticate')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Demonstration Mode - Auto-fill Test Credentials:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button"
              className="btn btn-outline" 
              style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
              onClick={() => {
                setUsername('admin');
                setPassword('password123');
              }}
            >
              Demo as Admin
            </button>
            <button 
              type="button"
              className="btn btn-outline" 
              style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
              onClick={() => {
                setUsername('employee01');
                setPassword('password123');
              }}
            >
              Demo as Employee
            </button>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Simulation Environment • Explicit Authentication Required
        </div>
      </div>
    </div>
  );
}
