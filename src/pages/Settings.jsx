import { useState } from 'react';
import {
  Shield, Key, Smartphone, Eye, EyeOff, Check, X,
  Lock, User, Bell, ChevronRight, AlertTriangle, Zap,
  TrendingUp, RefreshCw, LogOut, Download
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

function PasswordStrengthMeter({ password }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter(c => c.pass).length;
  const pct = (passed / checks.length) * 100;

  const getStrength = () => {
    if (passed <= 1) return { label: 'Very Weak', color: '#ef4444' };
    if (passed === 2) return { label: 'Weak', color: '#f97316' };
    if (passed === 3) return { label: 'Fair', color: '#f59e0b' };
    if (passed === 4) return { label: 'Strong', color: '#4ade80' };
    return { label: 'Very Strong', color: '#00d4aa' };
  };

  const { label, color } = getStrength();

  if (!password) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Password strength</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{label}</span>
      </div>
      <div style={{ height: 5, background: 'var(--color-border)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'all 0.3s ease' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: c.pass ? color : 'var(--color-text-muted)' }}>
            {c.pass ? <Check size={11} /> : <X size={11} />}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function OTPModal({ onClose, onVerify }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the 6-digit code.'); return; }
    setVerifying(true);
    setTimeout(() => {
      if (code === '123456') { onVerify(); onClose(); }
      else { setError('Invalid code. Try 123456 for demo.'); setVerifying(false); }
    }, 1400);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="card" style={{ width: 420, padding: 32, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ margin: 0 }}>Verify 2FA</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Enter the 6-digit code from your authenticator app</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Smartphone size={40} color="var(--color-accent-teal)" style={{ marginBottom: 8 }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: 0 }}>
            Demo: use code <strong style={{ color: 'var(--color-accent-teal)' }}>123456</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={d}
              onChange={e => handleInput(i, e.target.value)}
              onKeyDown={e => e.key === 'Backspace' && !otp[i] && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
              style={{
                width: 46, height: 52, textAlign: 'center', fontSize: '1.3rem', fontWeight: 800,
                background: 'var(--color-bg-glass)', border: `2px solid ${d ? 'var(--color-accent-teal)' : 'var(--color-border)'}`,
                borderRadius: 12, color: 'var(--color-text-primary)', outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            />
          ))}
        </div>

        {error && <p style={{ color: '#fc8181', fontSize: '0.8rem', textAlign: 'center', marginBottom: 12 }}>{error}</p>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleVerify} disabled={verifying}>
          {verifying ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Shield size={16} />}
          {verifying ? 'Verifying...' : 'Verify Code'}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, logout, updateRole } = useAuth();
  const [activeSection, setActiveSection] = useState('security');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    meetings: true, payments: true, documents: false, deals: true,
  });

  const SECTIONS = [
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'account', label: 'Account', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'access', label: 'Access & Role', icon: Key },
  ];

  const handlePasswordChange = () => {
    if (!currentPw || !newPw) { alert('Fill all fields.'); return; }
    if (newPw !== confirmPw) { alert('Passwords do not match.'); return; }
    if (newPw.length < 8) { alert('Password must be at least 8 characters.'); return; }
    setPwSuccess(true);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <Layout>
      <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
            <Shield size={24} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--color-accent-teal)' }} />
            Settings
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Manage your account, security, and preferences
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Sidebar nav */}
          <div>
            <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {SECTIONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start', gap: 10, width: '100%',
                    padding: '10px 14px', fontSize: '0.875rem',
                    background: activeSection === s.key ? 'var(--color-accent-teal-dim)' : 'transparent',
                    color: activeSection === s.key ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)',
                    borderRadius: 10, fontWeight: activeSection === s.key ? 700 : 500,
                  }}
                >
                  <s.icon size={16} />
                  {s.label}
                  {activeSection === s.key && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Security */}
            {activeSection === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Password */}
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Lock size={18} color="var(--color-accent-teal)" /> Change Password
                  </h3>

                  {pwSuccess && (
                    <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#00d4aa', fontSize: '0.875rem' }}>
                      <Check size={16} /> Password changed successfully!
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label className="form-label">Current Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type={showCurrent ? 'text' : 'password'}
                          placeholder="Enter current password"
                          value={currentPw}
                          onChange={e => setCurrentPw(e.target.value)}
                          style={{ paddingRight: 42 }}
                        />
                        <button className="btn btn-ghost btn-icon"
                          onClick={() => setShowCurrent(s => !s)}
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6 }}>
                          {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type={showNew ? 'text' : 'password'}
                          placeholder="Enter new password"
                          value={newPw}
                          onChange={e => setNewPw(e.target.value)}
                          style={{ paddingRight: 42 }}
                        />
                        <button className="btn btn-ghost btn-icon"
                          onClick={() => setShowNew(s => !s)}
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6 }}>
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <PasswordStrengthMeter password={newPw} />
                    </div>

                    <div>
                      <label className="form-label">Confirm New Password</label>
                      <input
                        className="form-input"
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        style={{ borderColor: confirmPw && confirmPw !== newPw ? '#fc8181' : undefined }}
                      />
                      {confirmPw && confirmPw !== newPw && (
                        <p style={{ fontSize: '0.75rem', color: '#fc8181', marginTop: 4 }}>Passwords do not match</p>
                      )}
                    </div>

                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={handlePasswordChange}>
                      <Key size={15} /> Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: twoFAEnabled ? 'rgba(0,212,170,0.15)' : 'rgba(148,163,184,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Smartphone size={20} color={twoFAEnabled ? 'var(--color-accent-teal)' : 'var(--color-text-muted)'} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Two-Factor Authentication</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          Add an extra layer of security to your account using an authenticator app
                        </p>
                        {twoFAEnabled && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#00d4aa', fontSize: '0.75rem', fontWeight: 700, marginTop: 6 }}>
                            <Check size={12} /> Active & Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => twoFAEnabled ? setTwoFAEnabled(false) : setShow2FAModal(true)}
                      style={{
                        width: 52, height: 28, borderRadius: 99,
                        background: twoFAEnabled ? 'var(--color-accent-teal)' : 'var(--color-border)',
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background 0.3s', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 4, transition: 'left 0.3s',
                        left: twoFAEnabled ? 28 : 4,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }} />
                    </button>
                  </div>

                  {!twoFAEnabled && (
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#f59e0b' }}>
                      <AlertTriangle size={15} /> Your account is not protected by 2FA. Enable it for better security.
                    </div>
                  )}
                </div>

                {/* Active sessions */}
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Key size={17} color="var(--color-accent-teal)" /> Active Sessions
                  </h3>
                  {[
                    { device: 'Chrome · Windows 11', location: 'Karachi, PK', time: 'Now (current)', active: true },
                    { device: 'Safari · iPhone 15', location: 'Karachi, PK', time: '2 hours ago', active: false },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid var(--color-border)' : 'none' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.active ? 'rgba(0,212,170,0.15)' : 'var(--color-bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Shield size={17} color={s.active ? 'var(--color-accent-teal)' : 'var(--color-text-muted)'} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.device}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.location} · {s.time}</div>
                        </div>
                      </div>
                      {!s.active && (
                        <button className="btn btn-ghost" style={{ fontSize: '0.75rem', color: '#fc8181', padding: '5px 12px' }}>
                          <LogOut size={13} /> Revoke
                        </button>
                      )}
                      {s.active && <span style={{ fontSize: '0.72rem', color: '#00d4aa', fontWeight: 700 }}>● Current</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account */}
            {activeSection === 'account' && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ margin: '0 0 24px', fontSize: '1rem' }}>Account Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
                  <div className={`avatar ${user?.role === 'investor' ? 'avatar-teal' : 'avatar-purple'}`}
                    style={{ width: 72, height: 72, fontSize: '1.5rem' }}>
                    {user?.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user?.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 2 }}>{user?.email}</div>
                    <div style={{ marginTop: 6 }}>
                      {user?.role === 'investor'
                        ? <span className="badge badge-teal"><TrendingUp size={11} /> Investor</span>
                        : <span className="badge badge-purple"><Zap size={11} /> Entrepreneur</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" defaultValue={user?.name} />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" defaultValue={user?.email} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea className="form-input" rows={3} placeholder="Tell investors / entrepreneurs about yourself..." />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary">Save Changes</button>
                    <button className="btn btn-ghost" style={{ color: '#fc8181' }}>
                      <Download size={14} /> Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '1rem' }}>Notification Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {Object.entries(notifications).map(([key, val], i, arr) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>
                          {key === 'meetings' ? '📅 Meeting Alerts' : key === 'payments' ? '💰 Payment Notifications' : key === 'documents' ? '📄 Document Updates' : '🚀 Deal Opportunities'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                          {key === 'meetings' ? 'Reminders and request alerts' :
                           key === 'payments' ? 'Transaction confirmations and alerts' :
                           key === 'documents' ? 'Signature requests and status changes' :
                           'New deals and funding opportunities'}
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                        style={{
                          width: 52, height: 28, borderRadius: 99,
                          background: val ? 'var(--color-accent-teal)' : 'var(--color-border)',
                          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: 4, transition: 'left 0.3s',
                          left: val ? 28 : 4, boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Access & Role */}
            {activeSection === 'access' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Current Role</h3>
                  <p style={{ margin: '0 0 20px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    Your role determines your dashboard view and available features.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {['investor', 'entrepreneur'].map(role => (
                      <div
                        key={role}
                        onClick={() => updateRole(role)}
                        style={{
                          padding: 20, borderRadius: 14, cursor: 'pointer',
                          background: user?.role === role ? (role === 'investor' ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)') : 'var(--color-bg-glass)',
                          border: user?.role === role ? (role === 'investor' ? '2px solid var(--color-accent-teal)' : '2px solid var(--color-accent-purple)') : '2px solid var(--color-border)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          {role === 'investor' ? <TrendingUp size={20} color="var(--color-accent-teal)" /> : <Zap size={20} color="var(--color-accent-purple)" />}
                          <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{role}</span>
                          {user?.role === role && <Check size={14} color={role === 'investor' ? 'var(--color-accent-teal)' : 'var(--color-accent-purple)'} style={{ marginLeft: 'auto' }} />}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {role === 'investor'
                            ? 'Access deal flow, funding tools, and portfolio management.'
                            : 'Access pitch tools, document chamber, and funding tracker.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Role-Based Features</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { feature: 'Dashboard Analytics', investor: true, entrepreneur: true },
                      { feature: 'Meeting Scheduler', investor: true, entrepreneur: true },
                      { feature: 'Video Calls', investor: true, entrepreneur: true },
                      { feature: 'Document Chamber', investor: true, entrepreneur: true },
                      { feature: 'Deal Funding Flow', investor: true, entrepreneur: false },
                      { feature: 'Portfolio Tracker', investor: true, entrepreneur: false },
                      { feature: 'Pitch Submission', investor: false, entrepreneur: true },
                      { feature: 'Funding Status View', investor: false, entrepreneur: true },
                    ].map((row, i, arr) => (
                      <div key={row.feature} style={{
                        display: 'grid', gridTemplateColumns: '1fr 80px 80px',
                        padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{row.feature}</span>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                          {row.investor
                            ? <span style={{ color: '#00d4aa' }}><Check size={15} /></span>
                            : <span style={{ color: 'var(--color-text-muted)' }}><X size={15} /></span>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                          {row.entrepreneur
                            ? <span style={{ color: '#a78bfa' }}><Check size={15} /></span>
                            : <span style={{ color: 'var(--color-text-muted)' }}><X size={15} /></span>}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px', padding: '8px 0' }}>
                      <span />
                      <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-accent-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investor</div>
                      <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-accent-purple)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Entrepreneur</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {show2FAModal && (
        <OTPModal
          onClose={() => setShow2FAModal(false)}
          onVerify={() => setTwoFAEnabled(true)}
        />
      )}
    </Layout>
  );
}
