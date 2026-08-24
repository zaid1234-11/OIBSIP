import React, { useState, useEffect } from 'react';
import api from './services/api';

export function App() {
  const [pingStatus, setPingStatus] = useState({
    loading: true,
    data: null,
    error: null,
    timestamp: null,
    latencyMs: null
  });

  const checkPing = async () => {
    setPingStatus(prev => ({ ...prev, loading: true, error: null }));
    const startTime = performance.now();
    try {
      const response = await api.get('/ping');
      const endTime = performance.now();
      setPingStatus({
        loading: false,
        data: response.data,
        error: null,
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: Math.round(endTime - startTime)
      });
    } catch (err) {
      setPingStatus({
        loading: false,
        data: null,
        error: err.message || 'Failed to connect to backend',
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: null
      });
    }
  };

  useEffect(() => {
    checkPing();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top, #2C2621 0%, #1E1A17 100%)'
    }}>
      {/* Header Wordmark */}
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3.5rem',
          letterSpacing: '0.18em',
          fontWeight: 700,
          color: 'var(--dough-cream)',
          textTransform: 'uppercase',
          margin: 0,
          position: 'relative',
          display: 'inline-block'
        }}>
          CRUST
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: 'var(--tomato)',
            borderRadius: '2px'
          }} />
        </h1>
        <p style={{
          marginTop: '18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#A89E94',
          letterSpacing: '0.05em'
        }}>
          CUSTOM PIZZA ORDERING PLATFORM · PHASE 1 FOUNDATION
        </p>
      </header>

      {/* Ticket Card Component for System Status */}
      <div style={{
        backgroundColor: 'var(--dough-cream)',
        color: 'var(--charcoal-ember)',
        borderRadius: 'var(--card-radius)',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
        position: 'relative',
        border: '1px dashed #D6C8B4'
      }}>
        {/* Ticket Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px dashed #C8BBA7',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--char-grey)',
              textTransform: 'uppercase'
            }}>
              SYSTEM HEALTH TICKET
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginTop: '4px'
            }}>
              TKT-001-PING
            </div>
          </div>

          {/* Status Pill */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 'var(--pill-radius)',
            backgroundColor: pingStatus.loading
              ? 'var(--mozzarella)'
              : pingStatus.data?.ok
                ? 'var(--basil)'
                : 'var(--tomato)',
            color: pingStatus.loading ? '#1E1A17' : 'var(--dough-cream)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {pingStatus.loading
              ? 'Checking...'
              : pingStatus.data?.ok
                ? 'Healthy'
                : 'Offline'}
          </div>
        </div>

        {/* Ticket Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--char-grey)' }}>Endpoint</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600 }}>GET /api/ping</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--char-grey)' }}>Server Response</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: pingStatus.data?.ok ? 'var(--basil)' : 'var(--tomato)'
            }}>
              {pingStatus.loading
                ? 'Awaiting response...'
                : pingStatus.data
                  ? JSON.stringify(pingStatus.data)
                  : pingStatus.error}
            </span>
          </div>

          {pingStatus.latencyMs !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--char-grey)' }}>Round-trip Latency</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{pingStatus.latencyMs} ms</span>
            </div>
          )}

          {pingStatus.timestamp && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--char-grey)' }}>Timestamp</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--char-grey)' }}>
                {pingStatus.timestamp}
              </span>
            </div>
          )}
        </div>

        {/* Retest CTA */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2D7C5' }}>
          <button
            id="retest-ping-btn"
            onClick={checkPing}
            disabled={pingStatus.loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--tomato)',
              color: 'var(--dough-cream)',
              border: 'none',
              borderRadius: 'var(--button-radius)',
              padding: '12px 20px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: pingStatus.loading ? 'not-allowed' : 'pointer',
              opacity: pingStatus.loading ? 0.7 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            {pingStatus.loading ? 'Connecting...' : 'Retest Ping Connection'}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <footer style={{
        marginTop: '32px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--char-grey)'
      }}>
        React + Vite (/client) ↔ Express API (/server)
      </footer>
    </div>
  );
}

export default App;
