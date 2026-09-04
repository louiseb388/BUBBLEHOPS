'use client';

import { useState } from 'react';

const TOPICS = ['A custom pair', 'An existing order', 'Press', 'Something else'];

export default function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, name, email, message })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div style={{ border: '2px solid var(--ink)', background: 'var(--tint)', padding: 32 }}>
        <h2 className="h-display h3" style={{ marginBottom: 8 }}>Thanks — that&apos;s sent.</h2>
        <p className="body-text" style={{ margin: 0 }}>We reply within one working day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20, maxWidth: 520 }}>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          What&apos;s it about
        </legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TOPICS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTopic(t)}
              className={`tag ${topic === t ? 'tag-lime' : ''}`}
              style={{ background: topic === t ? undefined : '#fff', cursor: 'pointer' }}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
        />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, width: '100%', boxSizing: 'border-box' }}
        />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ border: '2px solid var(--ink)', padding: '12px 14px', fontSize: 15, resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
        />
      </label>

      {status === 'error' && (
        <p style={{ color: '#b3261e', margin: 0, fontSize: 14 }}>{error}</p>
      )}

      <button type="submit" className="btn btn-lime" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
