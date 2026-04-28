import { useState, useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  FileText, Upload, Eye, Pen, Check, Clock,
  X, Download, Filter, Plus, FileBadge,
  ChevronDown, Trash2, AlertCircle
} from 'lucide-react';
import Layout from '../components/Layout';

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', icon: Clock },
  in_review: { label: 'In Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: AlertCircle },
  signed: { label: 'Signed', color: '#00d4aa', bg: 'rgba(0,212,170,0.15)', icon: Check },
};

const INITIAL_DOCS = [
  {
    id: 1, name: 'Series A Term Sheet.pdf', type: 'pdf',
    size: '245 KB', status: 'signed', uploaded: '2026-04-20',
    parties: ['Alex Morgan', 'Sarah Chen'], pages: 12,
  },
  {
    id: 2, name: 'NDA Agreement - Q2.pdf', type: 'pdf',
    size: '128 KB', status: 'in_review', uploaded: '2026-04-22',
    parties: ['James Park', 'NovaTech Inc.'], pages: 4,
  },
  {
    id: 3, name: 'Investment Contract Draft v3.docx', type: 'doc',
    size: '89 KB', status: 'draft', uploaded: '2026-04-24',
    parties: ['Pending'], pages: 18,
  },
  {
    id: 4, name: 'Shareholder Agreement.pdf', type: 'pdf',
    size: '312 KB', status: 'signed', uploaded: '2026-04-15',
    parties: ['Multiple parties'], pages: 26,
  },
];

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: config.bg, color: config.color,
      border: `1px solid ${config.color}40`,
      borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
    }}>
      <config.icon size={11} /> {config.label}
    </span>
  );
}

function SignatureModal({ doc, onClose, onSign }) {
  const sigRef = useRef(null);
  const [signed, setSigned] = useState(false);

  const handleClear = () => {
    sigRef.current?.clear();
    setSigned(false);
  };

  const handleSign = () => {
    if (sigRef.current?.isEmpty()) {
      alert('Please draw your signature before signing.');
      return;
    }
    onSign(doc.id);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div className="card" style={{ width: 560, padding: 32, maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0 }}>E-Signature</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{doc.name}</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Document preview placeholder */}
        <div style={{
          background: 'var(--color-bg-glass)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
          marginBottom: 20, textAlign: 'center',
        }}>
          <FileBadge size={40} color="var(--color-accent-teal)" style={{ marginBottom: 8 }} />
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.85rem' }}>
            {doc.name} · {doc.pages} pages · {doc.size}
          </p>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0', fontSize: '0.8rem' }}>
            Parties: {doc.parties.join(', ')}
          </p>
        </div>

        {/* Signature pad */}
        <div style={{ marginBottom: 16 }}>
          <label className="form-label" style={{ marginBottom: 8 }}>Draw your signature below</label>
          <div style={{
            border: '2px dashed var(--color-accent-teal)',
            borderRadius: 12,
            background: 'rgba(0,212,170,0.03)',
            overflow: 'hidden',
          }}>
            <SignatureCanvas
              ref={sigRef}
              penColor="#00d4aa"
              canvasProps={{
                width: 490, height: 160,
                style: { display: 'block', width: '100%', height: 160 },
              }}
              onEnd={() => setSigned(true)}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', margin: '6px 0 0' }}>
            By signing, you agree to the terms outlined in this document.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button className="btn btn-ghost" onClick={handleClear}>
            <X size={14} /> Clear
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSign}>
              <Check size={14} /> Sign Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div className="card" style={{ width: 640, maxHeight: '85vh', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileBadge size={20} color="var(--color-accent-teal)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doc.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.pages} pages · {doc.size}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-icon" title="Download"><Download size={16} /></button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        {/* Simulated PDF pages */}
        <div style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(85vh - 80px)' }}>
          {Array.from({ length: Math.min(doc.pages, 3) }).map((_, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 8, marginBottom: 16, padding: '40px 40px',
              color: '#1a1a2e', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', minHeight: 280,
            }}>
              <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #e5e7eb', paddingBottom: 16 }}>
                <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nexus Platform · Confidential</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: 8 }}>{doc.name.replace(/\.[^.]+$/, '')}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>Page {i + 1} of {doc.pages}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['This document constitutes a legal agreement between the parties named herein.',
                  'All terms and conditions set forth in this contract are binding upon execution.',
                  `Investment Amount: $${(Math.random() * 900000 + 100000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                  'This agreement is governed by the laws of the applicable jurisdiction.',
                  '', '', '',
                ].map((line, j) => (
                  <div key={j} style={{
                    height: line ? 'auto' : 14,
                    background: line ? 'transparent' : '#f3f4f6',
                    borderRadius: 4, fontSize: '0.82rem', color: '#374151', lineHeight: 1.6,
                  }}>{line}</div>
                ))}
              </div>
              {i === Math.min(doc.pages, 3) - 1 && doc.status === 'signed' && (
                <div style={{
                  marginTop: 32, borderTop: '1px solid #e5e7eb', paddingTop: 20,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    <div>Signed by: {doc.parties[0]}</div>
                    <div style={{ marginTop: 12, fontFamily: 'cursive', fontSize: '1.5rem', color: '#00d4aa' }}>
                      {doc.parties[0]?.split(' ').map(n => n[0]).join('') || '✓'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>
                    <div style={{ color: '#16a34a', fontWeight: 700 }}>✓ Digitally Signed</div>
                    <div style={{ marginTop: 4 }}>Nexus Platform</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {doc.pages > 3 && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '12px 0' }}>
              + {doc.pages - 3} more pages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Documents() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [filter, setFilter] = useState('all');
  const [signTarget, setSignTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);

  const handleSign = (id) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'signed' } : d));
  };

  const handleDelete = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleUpload = (files) => {
    Array.from(files).forEach(file => {
      const newDoc = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
        size: `${Math.round(file.size / 1024)} KB`,
        status: 'draft',
        uploaded: new Date().toISOString().split('T')[0],
        parties: ['Pending'],
        pages: Math.floor(Math.random() * 20) + 2,
      };
      setDocs(prev => [newDoc, ...prev]);
    });
  };

  const counts = { all: docs.length, draft: 0, in_review: 0, signed: 0 };
  docs.forEach(d => counts[d.status]++);

  return (
    <Layout>
      <div style={{ padding: '28px 32px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              <FileText size={24} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--color-accent-teal)' }} />
              Document Chamber
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Manage contracts, agreements, and e-signatures
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            <Plus size={16} /> Upload Document
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" multiple hidden
            onChange={e => handleUpload(e.target.files)} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { key: 'all', label: 'Total Documents', color: 'var(--color-accent-teal)' },
            { key: 'draft', label: 'Drafts', color: '#94a3b8' },
            { key: 'in_review', label: 'In Review', color: '#f59e0b' },
            { key: 'signed', label: 'Signed', color: '#00d4aa' },
          ].map(s => (
            <div key={s.key} className="card" style={{
              padding: '18px 20px', cursor: 'pointer',
              border: filter === s.key ? `1px solid ${s.color}60` : '1px solid var(--color-border)',
              background: filter === s.key ? `${s.color}10` : undefined,
            }} onClick={() => setFilter(s.key)}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{counts[s.key]}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-accent-teal)' : 'var(--color-border)'}`,
            borderRadius: 16, padding: '28px 20px',
            textAlign: 'center', marginBottom: 24, cursor: 'pointer',
            background: dragOver ? 'rgba(0,212,170,0.04)' : 'transparent',
            transition: 'all 0.2s ease',
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        >
          <Upload size={28} color={dragOver ? 'var(--color-accent-teal)' : 'var(--color-text-muted)'} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, color: dragOver ? 'var(--color-accent-teal)' : 'var(--color-text-secondary)' }}>
            Drop files here or click to upload
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            PDF, DOC, DOCX supported · Max 50MB per file
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['all', 'draft', 'in_review', 'signed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn btn-ghost"
              style={{
                padding: '6px 16px', fontSize: '0.8rem',
                background: filter === f ? 'var(--color-accent-teal-dim)' : 'transparent',
                color: filter === f ? 'var(--color-accent-teal)' : 'var(--color-text-muted)',
                border: filter === f ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
                textTransform: 'capitalize',
              }}
            >
              {f === 'in_review' ? 'In Review' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{
                marginLeft: 6, background: 'var(--color-bg-glass)',
                borderRadius: 10, padding: '0 6px', fontSize: '0.7rem',
              }}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Document list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(doc => {
            const statusConf = STATUS_CONFIG[doc.status];
            return (
              <div key={doc.id} className="card" style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  {/* File icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: doc.type === 'pdf' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                    border: `1px solid ${doc.type === 'pdf' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FileBadge size={20} color={doc.type === 'pdf' ? '#fc8181' : '#60a5fa'} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 4, color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      <span>{doc.size}</span>
                      <span>{doc.pages} pages</span>
                      <span>Uploaded {doc.uploaded}</span>
                      <span>Parties: {doc.parties.join(', ')}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <StatusBadge status={doc.status} />

                    {/* Status change */}
                    {doc.status !== 'signed' && (
                      <select
                        className="form-input"
                        style={{ fontSize: '0.75rem', padding: '5px 10px', minWidth: 110 }}
                        value={doc.status}
                        onChange={e => handleStatusChange(doc.id, e.target.value)}
                      >
                        <option value="draft">Draft</option>
                        <option value="in_review">In Review</option>
                        <option value="signed">Signed</option>
                      </select>
                    )}

                    {/* Actions */}
                    <button className="btn btn-ghost btn-icon" title="Preview" onClick={() => setPreviewTarget(doc)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn btn-ghost btn-icon" title="Download">
                      <Download size={16} />
                    </button>
                    {doc.status !== 'signed' && (
                      <button
                        className="btn btn-primary btn-icon"
                        style={{ padding: '7px 12px', gap: 6, fontSize: '0.8rem' }}
                        title="Sign"
                        onClick={() => setSignTarget(doc)}
                      >
                        <Pen size={14} /> Sign
                      </button>
                    )}
                    <button className="btn btn-ghost btn-icon" title="Delete"
                      style={{ color: '#fc8181' }} onClick={() => handleDelete(doc.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <FileText size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No documents found.</p>
            </div>
          )}
        </div>
      </div>

      {signTarget && (
        <SignatureModal
          doc={signTarget}
          onClose={() => setSignTarget(null)}
          onSign={handleSign}
        />
      )}

      {previewTarget && (
        <PreviewModal
          doc={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}
    </Layout>
  );
}
