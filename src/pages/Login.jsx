import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Zap, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const pct = (score / 4) * 100;
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex:1, height:4, borderRadius:99,
            background: i <= score ? colors[score] : 'var(--color-border)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.75rem', color: colors[score] || 'var(--color-text-muted)' }}>
          {labels[score]}
        </span>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize:'0.65rem', color: c.ok ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
              {c.ok ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function OTPStep({ onVerify, onBack }) {
  const [otp, setOtp] = useState(['','','','','','']);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (val, i) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i+1}`)?.focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i-1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Enter all 6 digits.'); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1000));
    // Demo: any 6-digit code works
    if (code === '000000') { setError('Incorrect code. Try any other 6 digits for demo.'); setVerifying(false); return; }
    setVerifying(false);
    onVerify();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{
          width:64, height:64, margin:'0 auto 16px',
          background:'var(--color-accent-teal-dim)',
          border:'1px solid rgba(0,212,170,0.3)',
          borderRadius:16,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Shield size={30} color="var(--color-accent-teal)" />
        </div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, marginBottom:8 }}>
          Two-Factor Authentication
        </h2>
        <p style={{ color:'var(--color-text-muted)', fontSize:'0.875rem' }}>
          Enter the 6-digit code from your authenticator app.<br/>
          <span style={{ color:'var(--color-accent-teal)', fontSize:'0.8rem' }}>Demo: enter any 6 digits (not 000000)</span>
        </p>
      </div>

      <div className="otp-inputs" style={{ marginBottom:24 }}>
        {otp.map((d, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            className="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && <p style={{ color:'var(--color-error)', fontSize:'0.8rem', textAlign:'center', marginBottom:12 }}>{error}</p>}

      <button
        className="btn btn-primary btn-lg"
        style={{ width:'100%', marginBottom:12 }}
        onClick={handleVerify}
        disabled={verifying}
      >
        {verifying ? <><div className="spinner" style={{width:18,height:18}} /> Verifying…</> : <>Verify & Continue <ArrowRight size={16} /></>}
      </button>
      <button className="btn btn-ghost" style={{ width:'100%' }} onClick={onBack}>
        ← Back to login
      </button>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = credentials, 2 = 2FA
  const [role, setRole] = useState('investor');
  const [email, setEmail] = useState('investor@nexus.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFA, setTwoFA] = useState(true);

  const fillDemo = () => {
    const e = role === 'investor' ? 'investor@nexus.com' : 'entrepreneur@nexus.com';
    setEmail(e);
    setPassword('Demo@1234');
    setError('');
  };

  const handleRoleSwitch = (r) => {
    setRole(r);
    setEmail(r === 'investor' ? 'investor@nexus.com' : 'entrepreneur@nexus.com');
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    if (twoFA) { setStep(2); return; }
    navigate('/dashboard');
  };

  const handleOTPVerified = () => navigate('/dashboard');

  return (
    <div style={{
      minHeight:'100vh',
      background:'var(--color-bg-primary)',
      display:'flex',
      position:'relative',
      overflow:'hidden',
    }}>
      <div className="bg-gradient-mesh" />

      {/* Left Panel – Branding */}
      <div style={{
        flex:'0 0 42%',
        display:'flex', flexDirection:'column',
        justifyContent:'center', alignItems:'flex-start',
        padding:'60px 56px',
        borderRight:'1px solid var(--color-border)',
        position:'relative',
      }} className="left-panel">

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:64 }}>
          <div style={{
            width:44, height:44,
            background:'linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-purple))',
            borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Zap size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.4rem' }}>Nexus</div>
            <div style={{ fontSize:'0.65rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Platform</div>
          </div>
        </div>

        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem', fontWeight:800, lineHeight:1.15, marginBottom:20, letterSpacing:'-0.02em' }}>
          Where Deals<br/>
          <span style={{ background:'linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-purple))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Get Done.
          </span>
        </h1>

        <p style={{ fontSize:'1rem', color:'var(--color-text-muted)', lineHeight:1.7, maxWidth:380, marginBottom:48 }}>
          Connect investors and entrepreneurs on a secure, all-in-one collaboration platform. Meetings, documents, deals — all in one place.
        </p>

        {[
          { icon: TrendingUp, text: 'Role-based investor & entrepreneur dashboards' },
          { icon: Shield, text: 'Bank-grade security with 2FA authentication' },
          { icon: CheckCircle2, text: 'End-to-end deal and document management' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{
              width:32, height:32,
              background:'var(--color-accent-teal-dim)',
              border:'1px solid rgba(0,212,170,0.2)',
              borderRadius:8,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <Icon size={15} color="var(--color-accent-teal)" />
            </div>
            <span style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)' }}>{text}</span>
          </div>
        ))}

        {/* Floating card decoration */}
        <div className="animate-float" style={{
          position:'absolute', bottom:48, right:-24,
          background:'var(--color-bg-glass)', border:'1px solid var(--color-border)',
          borderRadius:16, padding:'14px 18px', backdropFilter:'blur(20px)',
          display:'flex', alignItems:'center', gap:12,
          boxShadow:'var(--shadow-md)',
        }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--color-accent-teal-dim)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <TrendingUp size={18} color="var(--color-accent-teal)" />
          </div>
          <div>
            <div style={{ fontSize:'0.7rem', color:'var(--color-text-muted)' }}>Total Deals Closed</div>
            <div style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--color-accent-teal)' }}>$2.4M</div>
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'48px 40px',
      }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {step === 2 ? (
            <OTPStep onVerify={handleOTPVerified} onBack={() => setStep(1)} />
          ) : (
            <div className="animate-fade-in">
              <div style={{ marginBottom:32 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, marginBottom:6 }}>
                  Welcome back
                </h2>
                <p style={{ color:'var(--color-text-muted)', fontSize:'0.875rem' }}>
                  Sign in to your Nexus account
                </p>
              </div>

              {/* Role toggle */}
              <div style={{
                display:'grid', gridTemplateColumns:'1fr 1fr', gap:8,
                padding:4, background:'var(--color-bg-glass)',
                border:'1px solid var(--color-border)',
                borderRadius:'var(--radius-md)', marginBottom:28,
              }}>
                {['investor', 'entrepreneur'].map(r => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    style={{
                      padding:'10px', borderRadius:8,
                      background: role === r ? (r === 'investor' ? 'var(--color-accent-teal-dim)' : 'var(--color-accent-purple-dim)') : 'transparent',
                      border: role === r ? `1px solid ${r === 'investor' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}` : '1px solid transparent',
                      color: role === r ? (r === 'investor' ? 'var(--color-accent-teal)' : 'var(--color-accent-purple)') : 'var(--color-text-muted)',
                      fontWeight:600, fontSize:'0.8rem',
                      transition:'all 0.2s ease',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                    }}
                  >
                    {r === 'investor' ? <TrendingUp size={14} /> : <Zap size={14} />}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position:'relative' }}>
                    <input
                      className="form-input"
                      type={showPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{ paddingRight:44 }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      style={{
                        position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                        background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer'
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.8rem', color:'var(--color-text-secondary)' }}>
                    <input
                      type="checkbox"
                      checked={twoFA}
                      onChange={e => setTwoFA(e.target.checked)}
                      style={{ accentColor:'var(--color-accent-teal)', width:14, height:14 }}
                    />
                    Enable 2FA step
                  </label>
                  <a href="#" style={{ fontSize:'0.8rem', color:'var(--color-accent-teal)' }}>Forgot password?</a>
                </div>

                {error && (
                  <div style={{
                    padding:'10px 14px', borderRadius:'var(--radius-md)',
                    background:'var(--color-error-dim)', border:'1px solid rgba(239,68,68,0.2)',
                    fontSize:'0.8rem', color:'var(--color-error)',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ width:'100%', marginTop:4 }}
                >
                  {loading ? <><div className="spinner" style={{width:18,height:18}} /> Signing in…</> : <>Sign In <ArrowRight size={16} /></>}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={fillDemo}
                  style={{ width:'100%', fontSize:'0.8rem' }}
                >
                  Use Demo Credentials
                </button>
              </form>

              <div className="divider-text" style={{ margin:'24px 0', fontSize:'0.75rem' }}>or</div>

              <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--color-text-muted)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color:'var(--color-accent-teal)', fontWeight:600 }}>
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .left-panel { display:none!important; }
        }
      `}</style>
    </div>
  );
}
