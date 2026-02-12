import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import VignarthaBillManager from "./components/ VignarthaBillManager";
import MorayaTradersManager from "./components/Morayatradersmanager";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/vighnartha/*" element={<VignarthaBillManager />} />
        <Route path="/moraya/*" element={<MorayaTradersManager />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px 40px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#2d3748', margin: '0 0 20px 0' }}>
            📊 Billing System
          </h1>
          <p style={{ fontSize: '18px', color: '#718096', margin: '0 0 40px 0' }}>
            Professional Invoice & Bill Management for Multiple Companies
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          
          {/* Vighnartha Card */}
          <Link to="/vighnartha" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '40px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>🚚</div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', margin: '0 0 15px 0', textAlign: 'center' }}>
                Vighnartha Transport
              </h2>
              <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 15px 0', textAlign: 'center' }}>
                Transport Services
              </p>
              <p style={{ fontSize: '13px', color: '#a0aec0', margin: '0', textAlign: 'center' }}>
                Billing & transport invoices
              </p>
            </div>
          </Link>

          {/* Moraya Traders Card */}
          <Link to="/moraya" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '40px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>📦</div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', margin: '0 0 15px 0', textAlign: 'center' }}>
                Moraya Traders
              </h2>
              <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 15px 0', textAlign: 'center' }}>
                Item-Based Billing
              </p>
              <p style={{ fontSize: '13px', color: '#a0aec0', margin: '0', textAlign: 'center' }}>
                Product & service item invoicing
              </p>
            </div>
          </Link>
        </div>
{/* 
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', margin: '0 0 15px 0' }}>
            🎯 Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ Independent Data</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>Each company has separate storage</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ Professional PDFs</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>Generate invoices with company branding</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ Easy Navigation</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>Switch between companies instantly</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ Data Persistence</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>LocalStorage keeps your data safe</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ Mobile Ready</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>Works on all devices</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', margin: '0 0 8px 0' }}>✓ No Config Needed</p>
              <p style={{ fontSize: '12px', color: '#718096', margin: '0' }}>Ready to use out of the box</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default App;