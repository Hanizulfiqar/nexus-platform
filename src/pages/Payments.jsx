import { useState } from 'react';
import {
  CreditCard, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
  TrendingUp, DollarSign, Clock, Check, X, Plus, Eye,
  ChevronDown, Wallet, Send, RefreshCw, AlertCircle, Zap
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'deposit', amount: 250000, sender: 'Alex Morgan', receiver: 'Nexus Wallet', status: 'completed', date: '2026-04-20', note: 'Initial deposit' },
  { id: 2, type: 'transfer', amount: 50000, sender: 'Alex Morgan', receiver: 'Sarah Chen', status: 'completed', date: '2026-04-21', note: 'Seed round funding - NovaTech' },
  { id: 3, type: 'transfer', amount: 75000, sender: 'Alex Morgan', receiver: 'James Park', status: 'pending', date: '2026-04-23', note: 'Series A initial tranche' },
  { id: 4, type: 'withdraw', amount: 10000, sender: 'Nexus Wallet', receiver: 'Bank Account', status: 'completed', date: '2026-04-24', note: 'Withdrawal' },
  { id: 5, type: 'deposit', amount: 100000, sender: 'VentureCo Ltd', receiver: 'Nexus Wallet', status: 'completed', date: '2026-04-19', note: 'Partnership fund' },
  { id: 6, type: 'transfer', amount: 25000, sender: 'Sarah Chen', receiver: 'Alex Morgan', status: 'failed', date: '2026-04-22', note: 'Revenue share Q1' },
];

const DEAL_OPPORTUNITIES = [
  { id: 1, company: 'NovaTech AI', stage: 'Series A', target: 500000, raised: 320000, equity: '8%', deadline: '2026-05-15' },
  { id: 2, company: 'GreenLoop Energy', stage: 'Seed', target: 150000, raised: 75000, equity: '12%', deadline: '2026-05-01' },
  { id: 3, company: 'MediScan Pro', stage: 'Pre-Seed', target: 80000, raised: 60000, equity: '15%', deadline: '2026-04-30' },
];

function ActionModal({ type, balance, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { alert('Enter a valid amount.'); return; }
    if (type !== 'deposit' && val > balance) { alert('Insufficient balance.'); return; }
    setStep(2);
    setTimeout(() => {
      onComplete({ type, amount: val, note, recipient });
      onClose();
    }, 1800);
  };

  const config = {
    deposit: { label: 'Deposit Funds', icon: ArrowDownLeft, color: '#00d4aa', btnLabel: 'Confirm Deposit' },
    withdraw: { label: 'Withdraw Funds', icon: ArrowUpRight, color: '#f59e0b', btnLabel: 'Confirm Withdrawal' },
    transfer: { label: 'Transfer Funds', icon: ArrowLeftRight, color: 'var(--color-accent-purple)', btnLabel: 'Confirm Transfer' },
  }[type];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div className="card" style={{ width: 460, padding: 32, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${config.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <config.icon size={20} color={config.color} />
                </div>
                <h3 style={{ margin: 0 }}>{config.label}</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--color-bg-glass)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Available Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-teal)', marginTop: 4 }}>
                ${balance.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Amount (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                  <input className="form-input" type="number" placeholder="0.00"
                    style={{ paddingLeft: 28 }}
                    value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
              </div>

              {(type === 'transfer' || type === 'withdraw') && (
                <div>
                  <label className="form-label">{type === 'transfer' ? 'Recipient' : 'Bank Account'}</label>
                  <input className="form-input"
                    placeholder={type === 'transfer' ? 'e.g. Sarah Chen / entrepreneur@nexus.com' : 'e.g. **** 4782'}
                    value={recipient} onChange={e => setRecipient(e.target.value)} />
                </div>
              )}

              <div>
                <label className="form-label">Note (optional)</label>
                <input className="form-input" placeholder="Purpose of transaction..."
                  value={note} onChange={e => setNote(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2, background: `linear-gradient(135deg, ${config.color}, ${config.color}bb)` }} onClick={handleSubmit}>
                  {config.btnLabel}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Processing */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `${config.color}20`, border: `2px solid ${config.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite',
            }}>
              <RefreshCw size={28} color={config.color} />
            </div>
            <h3>Processing Transaction...</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              ${parseFloat(amount).toLocaleString()} · {type}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DealFundingModal({ deal, onClose, onFund }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const pct = ((deal.raised / deal.target) * 100).toFixed(0);

  const handleFund = () => {
    const v = parseFloat(amount);
    if (!v || v <= 0) { alert('Enter a valid amount.'); return; }
    setStep(2);
    setTimeout(() => { onFund(deal.id, v); onClose(); }, 1800);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="card" style={{ width: 480, padding: 32, maxWidth: '92vw' }} onClick={e => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0 }}>Fund Deal</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{deal.company}</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--color-bg-glass)', borderRadius: 12, padding: 18, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                {[['Stage', deal.stage], ['Equity', deal.equity], ['Deadline', deal.deadline]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  <span>${deal.raised.toLocaleString()} raised</span>
                  <span>{pct}% of ${deal.target.toLocaleString()}</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-accent-teal), var(--color-accent-purple))', borderRadius: 99 }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Investment Amount (USD)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                <input className="form-input" type="number" placeholder="0.00" style={{ paddingLeft: 28 }}
                  value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleFund}>
                <Zap size={15} /> Fund This Deal
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,212,170,0.2)', border: '2px solid var(--color-accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}>
              <RefreshCw size={28} color="var(--color-accent-teal)" />
            </div>
            <h3>Processing Investment...</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Payments() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(290000);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [deals, setDeals] = useState(DEAL_OPPORTUNITIES);
  const [activeModal, setActiveModal] = useState(null);
  const [dealModal, setDealModal] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleComplete = ({ type, amount }) => {
    const tx = {
      id: Date.now(),
      type,
      amount,
      sender: type === 'deposit' ? 'External' : user?.name || 'You',
      receiver: type === 'withdraw' ? 'Bank Account' : 'Nexus Wallet',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      note: type,
    };
    setTransactions(prev => [tx, ...prev]);
    if (type === 'deposit') setBalance(b => b + amount);
    else setBalance(b => b - amount);
  };

  const handleFund = (id, amount) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, raised: d.raised + amount } : d));
    setBalance(b => b - amount);
    setTransactions(prev => [{
      id: Date.now(), type: 'transfer', amount,
      sender: user?.name || 'You',
      receiver: deals.find(d => d.id === id)?.company || 'Deal',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      note: 'Deal funding',
    }, ...prev]);
  };

  const statusColors = { completed: '#00d4aa', pending: '#f59e0b', failed: '#fc8181' };
  const txFiltered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <Layout>
      <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              <CreditCard size={24} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--color-accent-teal)' }} />
              Payments
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Manage your wallet, transfers, and deal investments
            </p>
          </div>
        </div>

        {/* Wallet Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #0d1b2e 100%)',
          borderRadius: 20, padding: '32px 36px', marginBottom: 28,
          border: '1px solid rgba(0,212,170,0.2)',
          boxShadow: '0 8px 40px rgba(0,212,170,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -60, right: 80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.08)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Wallet size={18} color="rgba(255,255,255,0.5)" />
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Nexus Wallet
                  </span>
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
                  ${balance.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                  Available balance · USD
                </div>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-purple))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={24} color="#fff" />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { type: 'deposit', label: 'Deposit', icon: ArrowDownLeft, color: '#00d4aa' },
                { type: 'withdraw', label: 'Withdraw', icon: ArrowUpRight, color: '#f59e0b' },
                { type: 'transfer', label: 'Transfer', icon: Send, color: '#a78bfa' },
              ].map(action => (
                <button
                  key={action.type}
                  onClick={() => setActiveModal(action.type)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${action.color}20`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${action.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon size={18} color={action.color} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Transaction History */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Transaction History</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'deposit', 'withdraw', 'transfer'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="btn btn-ghost"
                    style={{
                      padding: '5px 12px', fontSize: '0.75rem', textTransform: 'capitalize',
                      background: filter === f ? 'var(--color-accent-teal-dim)' : 'transparent',
                      color: filter === f ? 'var(--color-accent-teal)' : 'var(--color-text-muted)',
                      border: filter === f ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Type', 'Amount', 'Sender', 'Receiver', 'Date', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txFiltered.map(tx => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-glass)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: tx.type === 'deposit' ? 'rgba(0,212,170,0.15)' : tx.type === 'withdraw' ? 'rgba(245,158,11,0.15)' : 'rgba(167,139,250,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {tx.type === 'deposit' ? <ArrowDownLeft size={14} color="#00d4aa" /> :
                             tx.type === 'withdraw' ? <ArrowUpRight size={14} color="#f59e0b" /> :
                             <ArrowLeftRight size={14} color="#a78bfa" />}
                          </div>
                          <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: 600 }}>{tx.type}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.875rem', color: tx.type === 'deposit' ? '#00d4aa' : 'var(--color-text-primary)' }}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{tx.sender}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{tx.receiver}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{tx.date}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          color: statusColors[tx.status],
                          background: `${statusColors[tx.status]}15`,
                          border: `1px solid ${statusColors[tx.status]}30`,
                          borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                          textTransform: 'capitalize',
                        }}>
                          {tx.status === 'completed' ? <Check size={11} /> :
                           tx.status === 'pending' ? <Clock size={11} /> :
                           <X size={11} />}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deal Opportunities */}
          {user?.role === 'investor' && (
            <div>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Fund a Deal</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {deals.map(deal => {
                  const pct = Math.min(((deal.raised / deal.target) * 100), 100);
                  const remaining = deal.target - deal.raised;
                  return (
                    <div key={deal.id} className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{deal.company}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {deal.stage} · {deal.equity} equity · Due {deal.deadline}
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{deal.stage}</span>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                          <span>${deal.raised.toLocaleString()} raised</span>
                          <span>{pct.toFixed(0)}%</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: 'linear-gradient(90deg, var(--color-accent-teal), var(--color-accent-purple))', transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                          ${remaining.toLocaleString()} remaining of ${deal.target.toLocaleString()} target
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setDealModal(deal)}
                      >
                        <Zap size={14} /> Invest Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Entrepreneur: earnings summary */}
          {user?.role === 'entrepreneur' && (
            <div>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700 }}>Funding Status</h2>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <TrendingUp size={36} color="var(--color-accent-teal)" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent-teal)' }}>$125,000</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total funding received</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['From Investors', '$125,000'], ['Revenue Share Due', '$12,500'], ['Milestones Met', '3 of 5']].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{l}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeModal && (
        <ActionModal
          type={activeModal}
          balance={balance}
          onClose={() => setActiveModal(null)}
          onComplete={handleComplete}
        />
      )}

      {dealModal && (
        <DealFundingModal
          deal={dealModal}
          onClose={() => setDealModal(null)}
          onFund={handleFund}
        />
      )}
    </Layout>
  );
}
