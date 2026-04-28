import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'Min 8 chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special char', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex:1, height:3, borderRadius:99,
            background: i <= score ? colors[score] : 'var(--color-border)',
            transition:'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:'0.7rem', color: colors[score] }}>{labels[score]}</span>
        <div style={{ display:'flex', gap:8 }}>
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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('entrepreneur');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('All fields are required.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!agree) { setError('Please accept the Terms of Service.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(email, password, name, role);
    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight:'100vh', background:'var(--color-bg-primary)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'40px 20px', position:'relative',
    }}>
      <div className="bg-gradient-mesh" />

      <div style={{ width:'100%', maxWidth:480 }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36, justifyContent:'center' }}>
          <div style={{
            width:40, height:40,
            background:'linear-gradient(135deg,var(--color-accent-teal),var(--color-accent-purple))',
            borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem' }}>Nexus</span>
        </div>

        <div className="card" style={{ padding:36 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:700, marginBottom:6, textAlign:'center' }}>
            Create your account
          </h1>
          <p style={{ textAlign:'center', color:'var(--color-text-muted)', fontSize:'0.875rem', marginBottom:28 }}>
            Join Nexus as an Investor or Entrepreneur
          </p>

          {/* Role toggle */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:8,
            padding:4, background:'var(--color-bg-glass)',
            border:'1px solid var(--color-border)',
            borderRadius:'var(--radius-md)', marginBottom:24,
          }}>
            {[
              { r:'investor', label:'Investor', Icon:TrendingUp },
              { r:'entrepreneur', label:'Entrepreneur', Icon:Zap },
            ].map(({ r, label, Icon }) => (
              <button key={r} onClick={() => setRole(r)} style={{
                padding:'10px', borderRadius:8,
                background: role === r ? (r==='investor' ? 'var(--color-accent-teal-dim)' : 'var(--color-accent-purple-dim)') : 'transparent',
                border: role===r ? `1px solid ${r==='investor' ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}` : '1px solid transparent',
                color: role===r ? (r==='investor' ? 'var(--color-accent-teal)' : 'var(--color-accent-purple)') : 'var(--color-text-muted)',
                fontWeight:600, fontSize:'0.8rem', transition:'all 0.2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <input
                  className="form-input" type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password" value={password}
                  onChange={e => setPassword(e.target.value)} style={{ paddingRight:44 }}
                />
                <button type="button" onClick={() => setShowPw(p=>!p)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input" type="password" placeholder="Repeat password"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                style={{ borderColor: confirm && confirm !== password ? 'var(--color-error)' : undefined }}
              />
            </div>

            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'0.8rem', color:'var(--color-text-secondary)', marginTop:4 }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                style={{ accentColor:'var(--color-accent-teal)', width:14, height:14 }} />
              I agree to the{' '}
              <a href="#" style={{ color:'var(--color-accent-teal)' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color:'var(--color-accent-teal)' }}>Privacy Policy</a>
            </label>

            {error && (
              <div style={{
                padding:'10px 14px', borderRadius:'var(--radius-md)',
                background:'var(--color-error-dim)', border:'1px solid rgba(239,68,68,0.2)',
                fontSize:'0.8rem', color:'var(--color-error)',
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width:'100%', marginTop:4 }}>
              {loading
                ? <><div className="spinner" style={{width:18,height:18}} /> Creating account…</>
                : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--color-text-muted)', marginTop:20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--color-accent-teal)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
