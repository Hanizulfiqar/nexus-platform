import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Zap, CreditCard, CalendarDays, FileText, Video,
  ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INVESTOR_STATS = [
  { label:'Portfolio Value', value:'$2.4M', change:'+12.4%', up:true, color:'var(--color-accent-teal)' },
  { label:'Active Deals', value:'7', change:'+2 this month', up:true, color:'var(--color-accent-purple)' },
  { label:'Upcoming Meetings', value:'3', change:'This week', up:null, color:'var(--color-accent-gold)' },
  { label:'Pending Docs', value:'4', change:'Awaiting review', up:null, color:'var(--color-accent-rose)' },
];

const ENTREPRENEUR_STATS = [
  { label:'Funding Raised', value:'$450K', change:'+$50K this month', up:true, color:'var(--color-accent-teal)' },
  { label:'Investor Connections', value:'12', change:'+3 new', up:true, color:'var(--color-accent-purple)' },
  { label:'Upcoming Pitches', value:'2', change:'This week', up:null, color:'var(--color-accent-gold)' },
  { label:'Active Contracts', value:'5', change:'2 pending signature', up:null, color:'var(--color-accent-rose)' },
];

const UPCOMING_MEETINGS = [
  { id:1, title:'Pitch Review – SkyTech', with:'Alex Morgan', time:'Today, 3:00 PM', status:'confirmed', avatar:'AM' },
  { id:2, title:'Due Diligence Call', with:'Priya Sharma', time:'Tomorrow, 11:00 AM', status:'confirmed', avatar:'PS' },
  { id:3, title:'Term Sheet Discussion', with:'Carlos Reyes', time:'Apr 28, 2:00 PM', status:'pending', avatar:'CR' },
];

const RECENT_TRANSACTIONS = [
  { id:1, type:'received', label:'Investment – Round A', party:'Alex Morgan', amount:'+$100,000', date:'Apr 24', status:'completed' },
  { id:2, type:'sent', label:'Platform Fee', party:'Nexus Platform', amount:'-$299', date:'Apr 22', status:'completed' },
  { id:3, type:'received', label:'Revenue Share', party:'TechVentures Ltd', amount:'+$12,400', date:'Apr 20', status:'completed' },
  { id:4, type:'pending', label:'Series A Transfer', party:'GrowthFund LLC', amount:'+$250,000', date:'Apr 18', status:'pending' },
];

const QUICK_ACTIONS = [
  { label:'Schedule Meeting', icon:CalendarDays, path:'/meetings', color:'var(--color-accent-teal)' },
  { label:'Start Video Call', icon:Video, path:'/video', color:'var(--color-accent-purple)' },
  { label:'Upload Document', icon:FileText, path:'/documents', color:'var(--color-accent-gold)' },
  { label:'Make Payment', icon:CreditCard, path:'/payments', color:'var(--color-accent-blue)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const isInvestor = user?.role === 'investor';
  const stats = isInvestor ? INVESTOR_STATS : ENTREPRENEUR_STATS;
  const walletBalance = isInvestor ? '$1,240,500' : '$85,340';

  return (
    <div className="animate-fade-in" style={{ maxWidth:1200, margin:'0 auto' }}>
      {/* Welcome Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:700 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          {isInvestor
            ? <span className="badge badge-teal"><TrendingUp size={10} /> Investor</span>
            : <span className="badge badge-purple"><Zap size={10} /> Entrepreneur</span>
          }
        </div>
        <p style={{ color:'var(--color-text-muted)', fontSize:'0.9rem' }}>
          Here's what's happening with your {isInvestor ? 'portfolio' : 'startup'} today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:'0.75rem', color:'var(--color-text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
              {s.label}
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:800, color: s.color, marginBottom:6 }}>
              {s.value}
            </div>
            <div style={{ fontSize:'0.75rem', display:'flex', alignItems:'center', gap:4, color: s.up === true ? 'var(--color-success)' : s.up === false ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
              {s.up === true && <ArrowUpRight size={12} />}
              {s.up === false && <ArrowDownLeft size={12} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

        {/* Wallet Balance Card */}
        <div className="card" style={{
          background:'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(108,99,255,0.1))',
          border:'1px solid rgba(0,212,170,0.2)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', top:-20, right:-20,
            width:120, height:120,
            background:'radial-gradient(circle, rgba(0,212,170,0.15), transparent)',
            borderRadius:'50%',
          }} />
          <div style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
            <CreditCard size={12} style={{display:'inline',marginRight:4}} /> Wallet Balance
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:800, marginBottom:6 }}>
            {walletBalance}
          </div>
          <div style={{ fontSize:'0.8rem', color:'var(--color-text-muted)', marginBottom:20 }}>
            Available funds · Updated just now
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Link to="/payments" className="btn btn-primary btn-sm">Deposit</Link>
            <Link to="/payments" className="btn btn-secondary btn-sm">Withdraw</Link>
            <Link to="/payments" className="btn btn-secondary btn-sm">Transfer</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>
            Quick Actions
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {QUICK_ACTIONS.map(({ label, icon:Icon, path, color }) => (
              <Link key={label} to={path} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'12px 14px', borderRadius:'var(--radius-md)',
                border:'1px solid var(--color-border)',
                background:'var(--color-bg-glass)',
                transition:'all 0.2s',
                textDecoration:'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background='var(--color-bg-glass-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.background='var(--color-bg-glass)'; }}>
                <div style={{
                  width:32, height:32, borderRadius:8, flexShrink:0,
                  background:`rgba(${color === 'var(--color-accent-teal)' ? '0,212,170' : color === 'var(--color-accent-purple)' ? '108,99,255' : color === 'var(--color-accent-gold)' ? '245,166,35' : '77,159,255'},0.15)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <Icon size={15} color={color} />
                </div>
                <span style={{ fontSize:'0.8rem', fontWeight:500 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Upcoming Meetings */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontWeight:600, fontSize:'0.9rem' }}>Upcoming Meetings</div>
            <Link to="/meetings" style={{ fontSize:'0.75rem', color:'var(--color-accent-teal)', display:'flex', alignItems:'center', gap:4 }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {UPCOMING_MEETINGS.map(m => (
              <div key={m.id} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 12px', borderRadius:'var(--radius-md)',
                background:'var(--color-bg-glass)',
                border:'1px solid var(--color-border)',
              }}>
                <div className="avatar avatar-teal" style={{ width:32, height:32, fontSize:'0.7rem' }}>{m.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.title}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--color-text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                    <Clock size={10} /> {m.time}
                  </div>
                </div>
                <span className={`badge ${m.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize:'0.6rem' }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontWeight:600, fontSize:'0.9rem' }}>Recent Transactions</div>
            <Link to="/payments" style={{ fontSize:'0.75rem', color:'var(--color-accent-teal)', display:'flex', alignItems:'center', gap:4 }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {RECENT_TRANSACTIONS.map(t => (
              <div key={t.id} style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 12px', borderRadius:'var(--radius-md)',
                background:'var(--color-bg-glass)', border:'1px solid var(--color-border)',
              }}>
                <div style={{
                  width:32, height:32, borderRadius:8, flexShrink:0,
                  background: t.type === 'received' ? 'var(--color-success-dim)' : t.type === 'sent' ? 'var(--color-error-dim)' : 'var(--color-warning-dim)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {t.type === 'received' ? <ArrowDownLeft size={14} color="var(--color-success)" /> : t.type === 'sent' ? <ArrowUpRight size={14} color="var(--color-error)" /> : <Clock size={14} color="var(--color-warning)" />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.label}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--color-text-muted)' }}>{t.party} · {t.date}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, fontSize:'0.85rem', color: t.type === 'received' ? 'var(--color-success)' : t.type === 'sent' ? 'var(--color-error)' : 'var(--color-warning)' }}>
                    {t.amount}
                  </div>
                  <span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize:'0.55rem' }}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(auto-fit"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
