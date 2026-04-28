import { useState, useEffect, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Monitor, MonitorOff, Users, MoreVertical, Maximize2,
  Signal, Wifi, Clock, MessageSquare, Share2
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const PARTICIPANTS = [
  { id: 1, name: 'Alex Morgan', role: 'Investor', avatar: 'AM', muted: false, videoOn: true },
  { id: 2, name: 'Sarah Chen', role: 'Entrepreneur', avatar: 'SC', muted: true, videoOn: true },
];

function VideoTile({ participant, large, isLocal }) {
  const colors = {
    AM: ['#00d4aa', '#00b894'],
    SC: ['#6c63ff', '#4f46e5'],
    ME: ['#f59e0b', '#d97706'],
  };
  const [c1, c2] = colors[participant.avatar] || ['#6c63ff', '#4f46e5'];

  return (
    <div style={{
      position: 'relative',
      borderRadius: large ? 16 : 12,
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${c1}15, ${c2}25)`,
      border: `1px solid ${c1}40`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      minHeight: large ? 380 : 140,
    }}>
      {/* Simulated video background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 30% 40%, ${c1}10, transparent 60%), radial-gradient(ellipse at 70% 60%, ${c2}10, transparent 60%)`,
      }} />

      {/* Avatar */}
      <div style={{
        width: large ? 80 : 48,
        height: large ? 80 : 48,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: large ? '1.8rem' : '1rem',
        fontWeight: 800, color: '#fff',
        boxShadow: `0 0 30px ${c1}40`,
        zIndex: 1,
      }}>
        {participant.avatar}
      </div>

      {/* Name Tag */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        borderRadius: 8, padding: '4px 10px',
        fontSize: '0.75rem', zIndex: 2,
      }}>
        <span style={{ fontWeight: 600 }}>{isLocal ? 'You' : participant.name}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>
        <span style={{ color: c1 }}>{participant.role}</span>
      </div>

      {/* Muted indicator */}
      {participant.muted && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(239,68,68,0.9)', borderRadius: 6,
          padding: '3px 6px', zIndex: 2,
        }}>
          <MicOff size={12} color="#fff" />
        </div>
      )}

      {/* Connection quality */}
      {large && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', gap: 4, alignItems: 'center',
          background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 8px',
          fontSize: '0.7rem', zIndex: 2,
        }}>
          <Wifi size={11} color="#00d4aa" />
          <span style={{ color: '#00d4aa' }}>HD</span>
        </div>
      )}
    </div>
  );
}

export default function VideoCall() {
  const { user } = useAuth();
  const [callActive, setCallActive] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Alex Morgan', text: 'Ready to start the call?', time: '10:02' },
  ]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callActive]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    const now = new Date();
    setMessages(prev => [...prev, {
      from: user?.name || 'You',
      text: chatMsg,
      time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`,
    }]);
    setChatMsg('');
  };

  const localParticipant = {
    id: 0, name: user?.name || 'You', role: user?.role || 'User',
    avatar: user?.avatar || 'ME', muted: !audioOn, videoOn,
  };

  return (
    <Layout>
      <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              <Video size={24} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--color-accent-teal)' }} />
              Video Call
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {callActive
                ? <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    Live · {formatTime(elapsed)}
                  </span>
                : 'Connect with investors and entrepreneurs face-to-face'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-ghost"
              style={{ gap: 8, color: showChat ? 'var(--color-accent-teal)' : undefined }}
              onClick={() => setShowChat(s => !s)}
            >
              <MessageSquare size={16} /> Chat
            </button>
            <button className="btn btn-ghost" style={{ gap: 8 }}>
              <Users size={16} /> {PARTICIPANTS.length + 1} Participants
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {/* Main video area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Main tile */}
            {!callActive ? (
              /* Pre-call lobby */
              <div className="card" style={{ padding: 60, textAlign: 'center', minHeight: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent-teal), var(--color-accent-purple))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                  boxShadow: '0 0 60px rgba(0,212,170,0.3)',
                  margin: '0 auto',
                }}>
                  {user?.avatar || 'N'}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem' }}>Ready to Join?</h2>
                  <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                    {PARTICIPANTS.length} participant{PARTICIPANTS.length !== 1 ? 's' : ''} waiting in the room
                  </p>
                </div>
                {/* Device preview controls */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setVideoOn(v => !v)}
                    className={`btn ${videoOn ? 'btn-ghost' : 'btn-ghost'}`}
                    style={{ gap: 8, color: videoOn ? 'var(--color-text-primary)' : '#fc8181' }}
                  >
                    {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
                    {videoOn ? 'Camera On' : 'Camera Off'}
                  </button>
                  <button
                    onClick={() => setAudioOn(a => !a)}
                    className="btn btn-ghost"
                    style={{ gap: 8, color: audioOn ? 'var(--color-text-primary)' : '#fc8181' }}
                  >
                    {audioOn ? <Mic size={16} /> : <MicOff size={16} />}
                    {audioOn ? 'Mic On' : 'Mic Off'}
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ padding: '14px 40px', fontSize: '1rem', borderRadius: 16 }}
                  onClick={() => setCallActive(true)}
                >
                  <Phone size={18} /> Join Meeting
                </button>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>
                  Note: This is a  mock UI – no real video stream
                </p>
              </div>
            ) : (
              /* Active call */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Main speaker */}
                <div style={{ height: 400, borderRadius: 16 }}>
                  <VideoTile participant={PARTICIPANTS[0]} large />
                </div>
                {/* Thumbnail row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <VideoTile participant={PARTICIPANTS[1]} />
                  <VideoTile participant={localParticipant} isLocal />
                  {screenShare && (
                    <div style={{
                      borderRadius: 12, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140, flexDirection: 'column', gap: 8,
                    }}>
                      <Monitor size={28} color="var(--color-accent-purple)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple)' }}>Screen Share</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Controls bar */}
            {callActive && (
              <div className="card" style={{
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                {/* Mute */}
                <button
                  onClick={() => setAudioOn(a => !a)}
                  className="btn btn-ghost btn-icon"
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: audioOn ? 'var(--color-bg-glass)' : 'rgba(239,68,68,0.2)',
                    border: `1px solid ${audioOn ? 'var(--color-border)' : 'rgba(239,68,68,0.4)'}`,
                    color: audioOn ? 'var(--color-text-primary)' : '#fc8181',
                  }}
                  title={audioOn ? 'Mute' : 'Unmute'}
                >
                  {audioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                {/* Video toggle */}
                <button
                  onClick={() => setVideoOn(v => !v)}
                  className="btn btn-ghost btn-icon"
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: videoOn ? 'var(--color-bg-glass)' : 'rgba(239,68,68,0.2)',
                    border: `1px solid ${videoOn ? 'var(--color-border)' : 'rgba(239,68,68,0.4)'}`,
                    color: videoOn ? 'var(--color-text-primary)' : '#fc8181',
                  }}
                  title={videoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                {/* Screen share */}
                <button
                  onClick={() => setScreenShare(s => !s)}
                  className="btn btn-ghost btn-icon"
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: screenShare ? 'rgba(108,99,255,0.2)' : 'var(--color-bg-glass)',
                    border: `1px solid ${screenShare ? 'rgba(108,99,255,0.4)' : 'var(--color-border)'}`,
                    color: screenShare ? 'var(--color-accent-purple)' : 'var(--color-text-primary)',
                  }}
                  title="Screen Share"
                >
                  {screenShare ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </button>

                {/* Share link */}
                <button className="btn btn-ghost btn-icon" style={{ width: 52, height: 52, borderRadius: '50%' }} title="Share link">
                  <Share2 size={20} />
                </button>

                {/* End call */}
                <button
                  onClick={() => { setCallActive(false); setScreenShare(false); }}
                  className="btn btn-icon"
                  style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none', color: '#fff',
                    boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
                  }}
                  title="End call"
                >
                  <PhoneOff size={22} />
                </button>

                {/* More */}
                <button className="btn btn-ghost btn-icon" style={{ width: 52, height: 52, borderRadius: '50%' }}>
                  <MoreVertical size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Chat panel */}
          {showChat && (
            <div className="card" style={{ width: 300, display: 'flex', flexDirection: 'column', maxHeight: 600 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>
                <MessageSquare size={16} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color-accent-teal)' }} />
                Meeting Chat
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-teal)' }}>{m.from}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{m.time}</span>
                    </div>
                    <div style={{
                      background: 'var(--color-bg-glass)', borderRadius: 8, padding: '8px 12px',
                      fontSize: '0.82rem', color: 'var(--color-text-secondary)',
                    }}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
                  placeholder="Type a message..."
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary btn-icon" onClick={sendMessage} style={{ padding: '8px 14px' }}>
                  <Share2 size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
