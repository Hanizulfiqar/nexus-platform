import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CalendarDays, Plus, Check, X, Clock, User,
  ChevronRight, Bell, Calendar
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const INITIAL_REQUESTS = [
  {
    id: 1, from: 'Alex Morgan', role: 'investor',
    subject: 'Q2 Funding Discussion', date: '2026-04-28', time: '10:00',
    duration: 45, status: 'pending', avatar: 'AM',
  },
  {
    id: 2, from: 'Sarah Chen', role: 'entrepreneur',
    subject: 'Product Demo Review', date: '2026-04-30', time: '14:00',
    duration: 60, status: 'pending', avatar: 'SC',
  },
  {
    id: 3, from: 'James Park', role: 'investor',
    subject: 'Series A Term Sheet', date: '2026-05-02', time: '11:00',
    duration: 30, status: 'accepted', avatar: 'JP',
  },
];

const INITIAL_EVENTS = [
  {
    id: 'e1', title: '📅 Series A Term Sheet – James Park',
    start: '2026-05-02T11:00:00', end: '2026-05-02T11:30:00',
    backgroundColor: '#00d4aa22', borderColor: '#00d4aa', textColor: '#00d4aa',
  },
  {
    id: 'e2', title: '🎯 Product Strategy – Internal',
    start: '2026-04-26T09:00:00', end: '2026-04-26T10:00:00',
    backgroundColor: '#6c63ff22', borderColor: '#6c63ff', textColor: '#b0a8ff',
  },
];

function MeetingModal({ slot, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', start: slot || '', end: '', notes: '' });

  const handleSave = () => {
    if (!form.title || !form.start) return;
    onSave(form);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div className="card" style={{ width: 480, padding: 32, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ margin: 0 }}>Add Availability Slot</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="form-label">Meeting Title</label>
            <input className="form-input" placeholder="e.g. Q3 Funding Review"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Start Time</label>
              <input className="form-input" type="datetime-local"
                value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            </div>
            <div>
              <label className="form-label">End Time</label>
              <input className="form-input" type="datetime-local"
                value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="form-label">Notes (optional)</label>
            <textarea className="form-input" rows={3} placeholder="Meeting agenda or notes..."
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Add to Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Meetings() {
  const { user } = useAuth();
  const calRef = useRef(null);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [activeTab, setActiveTab] = useState('calendar');

  const pending = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');

  const handleDateClick = (info) => {
    setSelectedSlot(info.dateStr + 'T09:00');
    setShowModal(true);
  };

  const handleEventSave = (form) => {
    const newEvent = {
      id: `e${Date.now()}`,
      title: `📅 ${form.title}`,
      start: form.start,
      end: form.end || undefined,
      backgroundColor: '#00d4aa22',
      borderColor: '#00d4aa',
      textColor: '#00d4aa',
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const handleRequest = (id, action) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (action === 'accept') {
        const newEvent = {
          id: `req-${id}`,
          title: `📅 ${r.subject} – ${r.from}`,
          start: `${r.date}T${r.time}:00`,
          backgroundColor: '#00d4aa22',
          borderColor: '#00d4aa',
          textColor: '#00d4aa',
        };
        setEvents(prev => [...prev, newEvent]);
        return { ...r, status: 'accepted' };
      }
      return { ...r, status: 'declined' };
    }));
  };

  return (
    <Layout>
      <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              <CalendarDays size={24} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--color-accent-teal)' }} />
              Meetings
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Manage your schedule and meeting requests
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {pending.length > 0 && (
              <div className="badge badge-teal" style={{ gap: 6 }}>
                <Bell size={12} /> {pending.length} pending
              </div>
            )}
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Slot
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Upcoming', value: accepted.length + 2, icon: Calendar, color: 'var(--color-accent-teal)' },
            { label: 'Pending Requests', value: pending.length, icon: Bell, color: '#f59e0b' },
            { label: 'Total This Month', value: events.length, icon: Clock, color: 'var(--color-accent-purple)' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44,
                background: `${stat.color}20`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
          {['calendar', 'requests'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn btn-ghost"
              style={{
                borderRadius: '8px 8px 0 0',
                borderBottom: activeTab === tab ? '2px solid var(--color-accent-teal)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--color-accent-teal)' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab ? 700 : 500,
                textTransform: 'capitalize',
                padding: '10px 20px',
              }}
            >
              {tab === 'requests' ? `Requests${pending.length ? ` (${pending.length})` : ''}` : 'Calendar'}
            </button>
          ))}
        </div>

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="card" style={{ padding: 20, overflow: 'hidden' }}>
            <style>{`
              .fc { color: var(--color-text-primary); font-family: var(--font-sans); }
              .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 700 !important; }
              .fc-button { background: var(--color-bg-glass) !important; border: 1px solid var(--color-border) !important; color: var(--color-text-primary) !important; font-size: 0.8rem !important; border-radius: 8px !important; }
              .fc-button-primary:not(.fc-button-active):not(:disabled):hover { background: var(--color-accent-teal-dim) !important; color: var(--color-accent-teal) !important; }
              .fc-button-active { background: var(--color-accent-teal-dim) !important; color: var(--color-accent-teal) !important; border-color: rgba(0,212,170,0.3) !important; }
              .fc-daygrid-day { background: transparent; }
              .fc-daygrid-day:hover { background: var(--color-bg-glass); cursor: pointer; }
              .fc-daygrid-day-number { color: var(--color-text-secondary); font-size: 0.8rem; }
              .fc-col-header-cell-cushion { color: var(--color-text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
              .fc-scrollgrid { border-color: var(--color-border) !important; }
              .fc-scrollgrid-section-body td, .fc-scrollgrid-section-header td { border-color: var(--color-border) !important; }
              .fc-daygrid-day.fc-day-today { background: rgba(0,212,170,0.05) !important; }
              .fc-daygrid-day.fc-day-today .fc-daygrid-day-number { color: var(--color-accent-teal); font-weight: 700; }
            `}</style>
            <FullCalendar
              ref={calRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              dateClick={handleDateClick}
              editable={true}
              selectable={true}
              height={620}
              eventClick={(info) => {
                alert(`📅 ${info.event.title}`);
              }}
            />
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {requests.filter(r => r.status !== 'declined').map(req => (
              <div key={req.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Avatar */}
                <div className={`avatar ${req.role === 'investor' ? 'avatar-teal' : 'avatar-purple'}`} style={{ flexShrink: 0 }}>
                  {req.avatar}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.subject}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 2, display: 'flex', gap: 12 }}>
                    <span><User size={11} style={{ verticalAlign: 'middle' }} /> {req.from}</span>
                    <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {req.date} at {req.time}</span>
                    <span>({req.duration} min)</span>
                  </div>
                </div>
                {/* Status */}
                {req.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.8rem' }}
                      onClick={() => handleRequest(req.id, 'accept')}>
                      <Check size={14} /> Accept
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '7px 16px', fontSize: '0.8rem', color: '#fc8181' }}
                      onClick={() => handleRequest(req.id, 'decline')}>
                      <X size={14} /> Decline
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-teal"><Check size={12} /> Confirmed</span>
                )}
              </div>
            ))}
            {requests.filter(r => r.status !== 'declined').length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No meeting requests at this time.
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <MeetingModal
          slot={selectedSlot}
          onClose={() => { setShowModal(false); setSelectedSlot(''); }}
          onSave={handleEventSave}
        />
      )}
    </Layout>
  );
}
