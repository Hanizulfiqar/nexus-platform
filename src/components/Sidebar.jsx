import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Video, FileText, CreditCard,
  Settings, LogOut, TrendingUp, Zap, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/meetings', label: 'Meetings', icon: CalendarDays },
  { path: '/video', label: 'Video Call', icon: Video },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--color-bg-sidebar)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(20px)',
      flexShrink: 0,
      position: mobile ? 'fixed' : 'sticky',
      top: 0,
      left: 0,
      zIndex: 200,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-purple))',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
              Nexus
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Platform
            </div>
          </div>
        </div>
        {mobile && (
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* User Card */}
      {user && (
        <div style={{
          margin: '16px 12px',
          padding: '14px',
          background: 'var(--color-bg-glass)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div className={`avatar ${user.role === 'investor' ? 'avatar-teal' : 'avatar-purple'}`}>
              {user.avatar}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:'0.875rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.name}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                {user.role === 'investor'
                  ? <span className="badge badge-teal" style={{fontSize:'0.6rem', padding:'1px 7px'}}>
                      <TrendingUp size={9} /> Investor
                    </span>
                  : <span className="badge badge-purple" style={{fontSize:'0.6rem', padding:'1px 7px'}}>
                      <Zap size={9} /> Entrepreneur
                    </span>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex:1, padding:'8px 12px', display:'flex', flexDirection:'column', gap:4 }}>
        <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-muted)', padding:'8px 8px 4px' }}>
          Navigation
        </div>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={mobile ? onClose : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-accent-teal-dim)' : 'transparent',
              border: isActive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={13} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:'12px 12px 20px' }}>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width:'100%', justifyContent:'flex-start', gap:10, color:'var(--color-text-muted)' }}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
