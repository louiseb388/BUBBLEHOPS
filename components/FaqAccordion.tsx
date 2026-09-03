'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/data';

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number[]>([]);

  function toggle(i: number) {
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  return (
    <div style={{ borderTop: '2px solid var(--ink)' }}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.q} style={{ borderBottom: '2px solid var(--ink)' }}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                background: 'transparent',
                border: 'none',
                padding: '22px 0',
                textAlign: 'left',
                font: 'inherit'
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 17 }}>{item.q}</span>
              <span
                aria-hidden="true"
                style={{
                  flex: 'none',
                  width: 28,
                  height: 28,
                  border: '2px solid var(--ink)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="body-text" style={{ margin: '0 0 22px', maxWidth: '68ch' }}>
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
