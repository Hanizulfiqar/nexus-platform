import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/meetings': 'Meeting Scheduler',
  '/video': 'Video Call',
  '/documents': 'Document Chamber',
  '/payments': 'Payments',
  '/settings': 'Settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Nexus';

  return (
    <div style={{ display:'flex', minHeight:'100vh', position:'relative' }}>
      {/* Mesh BG */}
      <div className="bg-gradient-mesh" />

      {/* Sidebar – desktop */}
      <div style={{ display:'none' }} className="sidebar-desktop">
        <Sidebar />
      </div>
      <style>{`
        @media(min-width:769px){ .sidebar-desktop{display:block!important;} .mobile-only{display:none!important;} }
        @media(max-width:768px){ .sidebar-desktop{display:none!important;} }
      `}</style>

      {/* Sidebar – mobile overlay */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:199, backdropFilter:'blur(2px)' }}
          />
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <header style={{
          height: 'var(--header-height)',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(10,15,30,0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button
              className="btn btn-ghost btn-icon mobile-only"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.125rem', margin:0 }}>
              {title}
            </h1>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Search placeholder */}
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              background:'var(--color-bg-glass)', border:'1px solid var(--color-border)',
              borderRadius:'var(--radius-md)', padding:'6px 14px',
              fontSize:'0.8rem', color:'var(--color-text-muted)',
            }}>
              <Search size={14} />
              <span>Search…</span>
            </div>

            {/* Notifications */}
            <button className="btn btn-ghost btn-icon" aria-label="Notifications" style={{ position:'relative' }}>
              <Bell size={18} />
              <span style={{
                position:'absolute', top:4, right:4,
                width:8, height:8,
                background:'var(--color-accent-teal)',
                borderRadius:'50%',
                border:'2px solid var(--color-bg-primary)',
              }} />
            </button>

            {/* User avatar */}
            <div className={`avatar ${user?.role === 'investor' ? 'avatar-teal' : 'avatar-purple'}`}
              style={{ cursor:'pointer', fontSize:'0.75rem' }}>
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:'28px 28px', overflow:'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
