import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Landing() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_requests: 0, allowed_requests: 0, denied_requests: 0, failed_logins: 0 });
  const [loading, setLoading] = useState(true);
  
  // Animation state for the live flow
  const [flowState, setFlowState] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/audit/public-stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch public stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // Animate the flow diagram
    const interval = setInterval(() => {
      setFlowState(prev => (prev + 1) % 7);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#050b14', minHeight: '100vh', color: '#f8fafc', overflowX: 'hidden' }}>
      
      {/* Grid Background Effect */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '1.5rem 3rem', alignItems: 'center', borderBottom: '1px solid rgba(14, 165, 233, 0.1)', background: 'rgba(5, 11, 20, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ border: '1px solid #0ea5e9', color: '#0ea5e9', padding: '0.2rem 0.5rem', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>ZT</div>
          <div style={{ fontWeight: '600', letterSpacing: '1px' }}>
            ZERO TRUST ARCHITECTURE<br/>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '2px' }}>ENTERPRISE SECURITY</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', fontWeight: '500', color: '#94a3b8' }}>
          <span onClick={() => document.getElementById('overview').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', color: '#0ea5e9' }}>Overview</span>
          <span onClick={() => document.getElementById('architecture').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f8fafc'} onMouseOut={e => e.target.style.color='#94a3b8'}>Architecture</span>
          <span onClick={() => document.getElementById('security').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f8fafc'} onMouseOut={e => e.target.style.color='#94a3b8'}>Security</span>
          <span onClick={() => document.getElementById('threat-simulation').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f8fafc'} onMouseOut={e => e.target.style.color='#94a3b8'}>Threat Simulation</span>
          <span onClick={() => document.getElementById('monitoring').scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#f8fafc'} onMouseOut={e => e.target.style.color='#94a3b8'}>Monitoring</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
          SYSTEM OPERATIONAL
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '700', letterSpacing: '-0.03em', margin: 0, color: '#f8fafc', textShadow: '0 0 40px rgba(14, 165, 233, 0.3)' }}>
          ZERO TRUST<br/>ARCHITECTURE
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#0ea5e9', fontWeight: '400', letterSpacing: '4px', margin: '1rem 0 3rem' }}>
          NEVER TRUST. ALWAYS VERIFY.
        </h2>
        <p style={{ maxWidth: '600px', color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', margin: '0 auto 3rem' }}>
          A simulated enterprise security environment implementing:<br/>
          <span style={{ color: '#cbd5e1' }}>Identity Verification • MFA • RBAC • IAM • Micro-Segmentation • Encryption • Continuous Monitoring</span>
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ background: 'linear-gradient(90deg, #0284c7, #0ea5e9)', color: 'white', border: 'none', padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)', transition: 'all 0.3s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ENTER SECURITY CENTER
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
            style={{ background: 'transparent', color: '#0ea5e9', border: '1px solid rgba(14, 165, 233, 0.5)', padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)'; e.currentTarget.style.borderColor = '#0ea5e9'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)'; }}
          >
            EXPLORE ARCHITECTURE
          </button>
        </div>
      </section>

      {/* Live Zero Trust Flow */}
      <section id="architecture" style={{ position: 'relative', zIndex: 10, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '3px', marginBottom: '3rem' }}>LIVE ZERO TRUST FLOW</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '300px' }}>
          {/* Node 1 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 0 && flowState < 6 ? '#0ea5e9' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState === 0 ? 'rgba(14, 165, 233, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: flowState >= 0 && flowState < 6 ? '#f8fafc' : '#94a3b8', transition: 'color 0.5s' }}>USER</span>
          </div>
          <div style={{ width: '2px', height: '20px', background: flowState >= 1 && flowState < 6 ? '#0ea5e9' : '#334155', transition: 'all 0.5s ease-in-out' }}></div>
          
          {/* Node 2 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 1 && flowState < 6 ? '#10b981' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState === 1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: flowState >= 1 && flowState < 6 ? '#f8fafc' : '#94a3b8', transition: 'color 0.5s' }}>IDENTITY</span><br/>
            <span style={{ fontSize: '0.7rem', color: flowState >= 1 && flowState < 6 ? '#10b981' : '#64748b', transition: 'color 0.5s' }}>{flowState >= 1 && flowState < 6 ? '✓ VERIFIED' : 'PENDING'}</span>
          </div>
          <div style={{ width: '2px', height: '20px', background: flowState >= 2 && flowState < 6 ? '#10b981' : '#334155', transition: 'all 0.5s ease-in-out' }}></div>

          {/* Node 3 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 2 && flowState < 6 ? '#10b981' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState === 2 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: flowState >= 2 && flowState < 6 ? '#f8fafc' : '#94a3b8', transition: 'color 0.5s' }}>MFA</span><br/>
            <span style={{ fontSize: '0.7rem', color: flowState >= 2 && flowState < 6 ? '#10b981' : '#64748b', transition: 'color 0.5s' }}>{flowState >= 2 && flowState < 6 ? '✓ VERIFIED' : 'PENDING'}</span>
          </div>
          <div style={{ width: '2px', height: '20px', background: flowState >= 3 && flowState < 6 ? '#0ea5e9' : '#334155', transition: 'all 0.5s ease-in-out' }}></div>

          {/* Node 4 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 3 && flowState < 6 ? '#0ea5e9' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState === 3 ? 'rgba(14, 165, 233, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: flowState >= 3 && flowState < 6 ? '#f8fafc' : '#94a3b8', transition: 'color 0.5s' }}>POLICY ENGINE</span><br/>
            <span style={{ fontSize: '0.7rem', color: flowState >= 3 && flowState < 6 ? '#0ea5e9' : '#64748b', transition: 'color 0.5s' }}>{flowState === 3 ? 'EVALUATING...' : (flowState > 3 && flowState < 6 ? 'ENFORCED' : 'IDLE')}</span>
          </div>
          <div style={{ width: '2px', height: '20px', background: flowState >= 4 && flowState < 6 ? '#0ea5e9' : '#334155', transition: 'all 0.5s ease-in-out' }}></div>

          {/* Node 5 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 4 && flowState < 6 ? '#0ea5e9' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState === 4 ? 'rgba(14, 165, 233, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: flowState >= 4 && flowState < 6 ? '#f8fafc' : '#94a3b8', transition: 'color 0.5s' }}>RESOURCE ACCESS CHECK</span>
          </div>
          <div style={{ width: '2px', height: '20px', background: flowState >= 5 && flowState < 6 ? '#10b981' : '#334155', transition: 'all 0.5s ease-in-out' }}></div>

          {/* Node 6 */}
          <div style={{ width: '100%', padding: '1rem', border: `1px solid ${flowState >= 5 && flowState < 6 ? '#10b981' : '#334155'}`, borderRadius: '4px', textAlign: 'center', background: flowState >= 5 && flowState < 6 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.8)', transition: 'all 0.5s ease-in-out', boxShadow: flowState >= 5 && flowState < 6 ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: flowState >= 5 && flowState < 6 ? '#10b981' : '#64748b', letterSpacing: '1px', transition: 'color 0.5s' }}>ACCESS GRANTED</span>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section id="security" style={{ position: 'relative', zIndex: 10, padding: '6rem 2rem', background: 'rgba(2, 6, 23, 0.8)', borderTop: '1px solid rgba(14, 165, 233, 0.1)', borderBottom: '1px solid rgba(14, 165, 233, 0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '600', marginBottom: '4rem', color: '#f8fafc' }}>SECURITY WITHOUT IMPLICIT TRUST</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px' }}>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>[ IDENTITY ]</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Verify exactly who is requesting access cryptographically.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px' }}>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>[ MFA ]</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Verify the identity with an additional, non-phishable factor.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px' }}>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>[ RBAC ]</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Enforce strict, least-privilege permissions for every user role.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px' }}>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>[ MICRO-SEGMENTATION ]</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Restrict lateral movement between enterprise resources.</p>
            </div>

            <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px' }}>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', marginBottom: '1rem' }}>[ MONITORING ]</div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Record and cryptographically analyze every security decision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Every Request Every Time */}
      <section style={{ position: 'relative', zIndex: 10, padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '700', marginBottom: '4rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>EVERY REQUEST.<br/>EVERY TIME.</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Allowed Scenario */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '600' }}>
              EMPLOYEE → EMPLOYEE PORTAL
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>Identity Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>MFA Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>Role Authorized</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>Policy Passed</span>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '4px', color: '#10b981', fontWeight: '700', letterSpacing: '2px' }}>
                ACCESS GRANTED
              </div>
            </div>
          </div>

          {/* Denied Scenario */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '600' }}>
              EMPLOYEE → FINANCE ADMIN
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>Identity Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981', fontSize: '0.9rem' }}>
                ✓ <span style={{ color: '#cbd5e1' }}>MFA Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', fontSize: '0.9rem' }}>
                ✗ <span style={{ color: '#cbd5e1' }}>Role Unauthorized</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444', fontSize: '0.9rem' }}>
                ✗ <span style={{ color: '#cbd5e1' }}>Policy Failed</span>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '4px', color: '#ef4444', fontWeight: '700', letterSpacing: '2px' }}>
                ACCESS DENIED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assume Breach */}
      <section id="threat-simulation" style={{ position: 'relative', zIndex: 10, padding: '6rem 2rem', background: 'rgba(2, 6, 23, 0.8)', borderTop: '1px solid rgba(14, 165, 233, 0.1)', borderBottom: '1px solid rgba(14, 165, 233, 0.1)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>ASSUME BREACH.<br/>VERIFY EVERYTHING.</h2>
          <p style={{ color: '#94a3b8', marginBottom: '4rem' }}>Zero Trust prevents lateral movement when a single endpoint is compromised.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', color: '#fcd34d', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px' }}>[ EXTERNAL ACCESS ATTEMPT ]</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>POLICY ENGINE</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', borderRadius: '4px' }}>BLOCKED</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', color: '#fcd34d', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px' }}>[ INSIDER PRIVILEGE ATTEMPT ]</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>RBAC CHECK</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', borderRadius: '4px' }}>BLOCKED</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', color: '#fcd34d', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '1px' }}>[ INVALID MFA ATTEMPT ]</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>AUTHENTICATION</div>
              <div style={{ height: '20px', width: '1px', background: 'rgba(245, 158, 11, 0.5)', margin: '0.5rem 0' }}></div>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', borderRadius: '4px' }}>BLOCKED</div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = '#ef4444'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'; }}
          >
            [ LAUNCH THREAT SIMULATION ]
          </button>
        </div>
      </section>

      {/* Live Metrics */}
      <section id="monitoring" style={{ position: 'relative', zIndex: 10, padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#64748b', letterSpacing: '3px', marginBottom: '2rem', textAlign: 'center' }}>LIVE SYSTEM METRICS</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading secure telemetry...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '1rem' }}>ACCESS REQUESTS</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0ea5e9' }}>{stats.total_requests}</div>
            </div>
            
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '1rem' }}>ALLOWED</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981' }}>{stats.allowed_requests}</div>
            </div>
            
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '1rem' }}>DENIED</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444' }}>{stats.denied_requests}</div>
            </div>
            
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '1rem' }}>MFA FAILURES</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b' }}>{stats.failed_logins}</div>
            </div>
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '4rem 2rem 8rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '3rem', color: '#f8fafc', letterSpacing: '2px' }}>EXPERIENCE ZERO TRUST</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', color: '#94a3b8', fontSize: '0.85rem', letterSpacing: '1px' }}>
          <div>Authentication</div>
          <div style={{ margin: '0.5rem 0', color: '#0ea5e9' }}>↓</div>
          <div>Verification</div>
          <div style={{ margin: '0.5rem 0', color: '#0ea5e9' }}>↓</div>
          <div>Authorization</div>
          <div style={{ margin: '0.5rem 0', color: '#0ea5e9' }}>↓</div>
          <div>Monitoring</div>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: 'linear-gradient(90deg, #0284c7, #0ea5e9)', color: 'white', border: 'none', padding: '1.2rem 3rem', fontSize: '1rem', fontWeight: '600', letterSpacing: '1px', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 4px 30px rgba(14, 165, 233, 0.3)', transition: 'all 0.3s' }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          [ ENTER SECURITY CENTER ]
        </button>
      </section>

    </div>
  );
}
