import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Walkthrough() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          ⬅️ Back to Dashboard
        </div>
        <div style={{ color: '#10b981', fontWeight: 'bold' }}>
          Project Walkthrough Guide
        </div>
      </nav>

      <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ marginBottom: '2rem', border: '1px solid #0ea5e9' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Zero Trust Enterprise Architecture</h1>
          <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#cbd5e1' }}>
            A comprehensive guide to presenting and demonstrating this project for your internship interview.
          </p>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#818cf8', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>1</span>
            Core Philosophy
          </h2>
          <p>
            Traditional security models rely on a "castle-and-moat" approach, assuming everything inside the network is safe. 
            <strong>Zero Trust</strong> operates on the principle of <em>"Never Trust, Always Verify."</em> This project simulates a corporate network where no user, device, or service is inherently trusted, even if they are already inside the network.
          </p>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #10b981' }}>
          <h2 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#10b981', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>2</span>
            Identity & Authentication (Zone 1)
          </h2>
          <p>
            The demonstration begins at the Gateway. The system requires strong identity verification before issuing a cryptographically signed JWT (JSON Web Token).
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>How to demo:</strong> Log out and go to the login screen. Use the Auto-fill buttons to demonstrate logging in as different roles. You can also click "Setup MFA" on the dashboard to enable Multi-Factor Authentication and scan the QR code to test TOTP verification on your next login!</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Behind the scenes:</strong> The FastAPI backend hashes passwords and validates credentials against a SQLite database, strictly checking for active accounts and Multi-Factor Authentication (MFA) status using PyOTP.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #0ea5e9' }}>
          <h2 style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#0ea5e9', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>3</span>
            Policy Engine & Continuous Verification
          </h2>
          <p>
            A valid token is not enough. Every single request made to a resource must pass through the <strong>Policy Enforcement Point (PEP)</strong>, which queries the <strong>Policy Decision Point (PDP)</strong>.
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>How to demo:</strong> As an <em>Employee</em>, try to click the Finance Service tile. You will get a 403 Forbidden Access Denied error.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Behind the scenes:</strong> The Python backend intercepts the HTTP request, extracts your JWT, evaluates your <code>Role</code> against the <code>policies.json</code> file, and drops the request before it ever reaches the Finance service code.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #ec4899' }}>
          <h2 style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#ec4899', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>4</span>
            Micro-Segmentation & Assume Breach
          </h2>
          <p>
            The dashboard resources (Employee, HR, Finance, Admin) represent isolated network segments. 
            We operate under the <strong>"Assume Breach"</strong> mindset: if a hacker compromises an Employee's account, they cannot move laterally into the Finance or HR systems because the Policy Engine isolates the zones.
          </p>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #eab308' }}>
          <h2 style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#eab308', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>5</span>
            Audit Logging & Observability (Zone 6)
          </h2>
          <p>
            Zero Trust requires total visibility. Every authentication attempt and every policy decision (both ALLOW and DENY) is recorded in real-time.
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>How to demo:</strong> Log in as an Admin, intentionally click a tile you shouldn't have access to, and then open the <strong>Security Monitor</strong> tile.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Behind the scenes:</strong> You will see your exact request logged as a DENY event, complete with timestamps and the reason for the denial. This allows security analysts to detect compromised accounts attempting lateral movement.</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #8b5cf6' }}>
          <h2 style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#8b5cf6', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>6</span>
            Data Encryption (In-Transit & At-Rest)
          </h2>
          <p>
            A core pillar of Zero Trust is assuming the network is compromised, meaning all data must be encrypted to prevent eavesdropping and data exfiltration.
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>How to demo:</strong> Access any resource (like Finance) and notice the "🔒 Encrypted" validation check in the header.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Behind the scenes:</strong> User passwords are cryptographically hashed using <code>bcrypt</code> before being stored in SQLite (At-Rest). Identity tokens are securely signed using <code>HS256</code> to prevent tampering, and all data payloads are strictly transmitted via JSON over secure channels (simulating TLS In-Transit).</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #ef4444' }}>
          <h2 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#ef4444', color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>7</span>
            Threat Simulation
          </h2>
          <p>
            You can dynamically test the robustness of the Zero Trust Architecture against active threats by using the Threat Simulator.
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', marginBottom: '1rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>How to demo:</strong> Click the <strong>Threat Simulator</strong> tile on the dashboard to launch mock attacks such as an External Brute Force attack or Insider Lateral Movement. Check the Security Monitor immediately after!</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Behind the scenes:</strong> The frontend dispatches malicious requests to the API. The backend Identity Gateway intercepts the brute force, and the Policy Engine completely blocks the unauthorized lateral movement attempts, securely logging every single action.</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
