'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BASES_IN_STOCK, getBase, WORD_COLOURS } from '@/lib/data';
import { useStock, isSoldOut } from '@/lib/inventory';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { getSupabase } from '@/lib/supabase';
import {
  defaultDesign,
  priceForDesign,
  encodeDesign,
  decodeDesign,
  type DesignState,
  type Side
} from '@/lib/designer-types';
import ShoeStage from './ShoeStage';
import ShoeControls from './ShoeControls';
import Toolbar from './Toolbar';
import PriceBar from './PriceBar';
import styles from './Designer.module.css';

const STORAGE_KEY = 'bubblehops_design';
const HISTORY_LIMIT = 5;
const SAMPLE_WORDS = ['ARLO', 'MILO', 'ZARA', 'REX', 'IVY', 'FINN', 'NOVA', 'JAX'];

export default function DesignerClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { stock } = useStock();
  const { addLine } = useCart();
  const { session } = useAuth();

  const [design, setDesign] = useState<DesignState | null>(null);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const undoStack = useRef<DesignState[]>([]);
  const redoStack = useRef<DesignState[]>([]);
  const [, forceRender] = useState(0);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Load: URL share param > localStorage > query base param > first base.
  useEffect(() => {
    const shared = searchParams.get('d');
    if (shared) {
      const decoded = decodeDesign(shared);
      if (decoded) {
        setDesign(decoded);
        return;
      }
    }
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        setDesign(JSON.parse(stored));
        return;
      } catch {
        /* fall through */
      }
    }
    const baseParam = searchParams.get('base');
    const initialBase = baseParam && getBase(baseParam) ? baseParam : BASES_IN_STOCK[0].id;
    setDesign(defaultDesign(initialBase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage (debounced via effect + state change).
  useEffect(() => {
    if (!design) return;
    const id = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
    }, 300);
    return () => clearTimeout(id);
  }, [design]);

  const base = design ? getBase(design.baseId) || BASES_IN_STOCK[0] : BASES_IN_STOCK[0];

  const beginChange = useCallback(() => {
    if (!design) return;
    undoStack.current = [design, ...undoStack.current].slice(0, HISTORY_LIMIT);
    redoStack.current = [];
    forceRender((n) => n + 1);
  }, [design]);

  function undo() {
    const prev = undoStack.current[0];
    if (!prev || !design) return;
    redoStack.current = [design, ...redoStack.current].slice(0, HISTORY_LIMIT);
    undoStack.current = undoStack.current.slice(1);
    setDesign(prev);
  }
  function redo() {
    const next = redoStack.current[0];
    if (!next || !design) return;
    undoStack.current = [design, ...undoStack.current].slice(0, HISTORY_LIMIT);
    redoStack.current = redoStack.current.slice(1);
    setDesign(next);
  }

  function patchSide(which: 'left' | 'right', patch: Partial<Side>) {
    setDesign((d) => (d ? { ...d, [which]: { ...d[which], ...patch } } : d));
  }

  function pickBase(id: string) {
    beginChange();
    setDesign((d) => (d ? { ...d, baseId: id } : d));
  }

  function surpriseMe() {
    beginChange();
    const inStockBases = BASES_IN_STOCK.filter((b) => !isSoldOut(stock, b.id));
    const pool = inStockBases.length ? inStockBases : BASES_IN_STOCK;
    const randomBase = pool[Math.floor(Math.random() * pool.length)];
    const colourPool = WORD_COLOURS.filter((c) => c.id !== 'ink' && c.id !== 'grey');
    const randomSide = (): Side => ({
      blank: false,
      word: SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)],
      colour: colourPool[Math.floor(Math.random() * colourPool.length)].id,
      outline: Math.random() > 0.2 ? WORD_COLOURS[Math.floor(Math.random() * WORD_COLOURS.length)].id : 'none',
      font: Math.random() > 0.5 ? 'graffiti' : 'regular',
      size: 0.8 + Math.random() * 0.6,
      rot: Math.round((Math.random() - 0.5) * 40),
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      stickers: Math.random() > 0.5 ? [{ id: `st_${Date.now()}`, x: 30 + Math.random() * 40, y: 60 + Math.random() * 20, scale: 1 }] : []
    });
    setDesign({ baseId: randomBase.id, left: randomSide(), right: randomSide() });
  }

  async function shareDesign() {
    if (!design) return;
    const encoded = encodeDesign(design);
    const url = `${window.location.origin}/create-your-own?d=${encoded}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My BUBBLEHOPS design', url });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    await navigator.clipboard.writeText(url);
    setSaveMsg('Link copied to clipboard.');
    setTimeout(() => setSaveMsg(null), 3000);
  }

  function addToBasket() {
    if (!design || !base) return;
    const price = priceForDesign(base.price, design);
    addLine({ baseId: base.id, baseName: base.name, design, price, size: null });
  }

  async function saveDesign() {
    if (!design) return;
    if (!session) {
      window.localStorage.setItem('bubblehops_pending_save', JSON.stringify(design));
      router.push('/sign-in?next=/create-your-own');
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setSaveMsg('Saved designs need Supabase configured — see .env.example.');
      return;
    }
    const { error } = await supabase.from('saved_designs').upsert({
      user_id: session.user.id,
      base_id: design.baseId,
      design
    });
    setSaveMsg(error ? `Couldn't save: ${error.message}` : 'Design saved to your account.');
    setTimeout(() => setSaveMsg(null), 4000);
  }

  const bothPainted = !!design && !design.left.blank && !design.right.blank;
  const price = useMemo(() => (design && base ? priceForDesign(base.price, design) : 0), [design, base]);

  if (!design || !base) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading designer…</div>;
  }

  return (
    <div>
      <Toolbar
        base={base}
        bothPainted={bothPainted}
        stock={stock}
        onPickBase={pickBase}
        onShare={shareDesign}
        onSurprise={surpriseMe}
        onUndo={undo}
        onRedo={redo}
        canUndo={undoStack.current.length > 0}
        canRedo={redoStack.current.length > 0}
      />

      <div className={styles.stageWrap}>
        <div className={styles.stageGrid}>
          <ShoeStage
            base={base}
            side={design.left}
            which="left"
            active={activeSide === 'left'}
            onFocus={() => setActiveSide('left')}
            onMoveWord={(x, y) => {
              patchSide('left', { x, y });
            }}
            onMoveSticker={(id, x, y) => {
              setDesign((d) =>
                d ? { ...d, left: { ...d.left, stickers: d.left.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)) } } : d
              );
            }}
          />
          <ShoeStage
            base={base}
            side={design.right}
            which="right"
            active={activeSide === 'right'}
            onFocus={() => setActiveSide('right')}
            onMoveWord={(x, y) => {
              patchSide('right', { x, y });
            }}
            onMoveSticker={(id, x, y) => {
              setDesign((d) =>
                d ? { ...d, right: { ...d.right, stickers: d.right.stickers.map((s) => (s.id === id ? { ...s, x, y } : s)) } } : d
              );
            }}
          />
        </div>
        <p className={styles.disclaimer}>* A preview, not the finished pair — we hand-letter every word.</p>
      </div>

      <div className={styles.controlsWrap}>
        <div className={styles.controlsGrid}>
          <div>
            <ShoeControls
              label="Left"
              side={design.left}
              onBeginChange={beginChange}
              onChange={(patch) => patchSide('left', patch)}
              onResetSpot={() => {
                beginChange();
                patchSide('left', { x: 50, y: 50 });
              }}
              onCopyToOther={() => {
                beginChange();
                setDesign((d) => (d ? { ...d, right: { ...d.left, stickers: [...d.left.stickers] } } : d));
              }}
            />
          </div>
          <div>
            <ShoeControls
              label="Right"
              side={design.right}
              onBeginChange={beginChange}
              onChange={(patch) => patchSide('right', patch)}
              onResetSpot={() => {
                beginChange();
                patchSide('right', { x: 50, y: 50 });
              }}
              onCopyToOther={() => {
                beginChange();
                setDesign((d) => (d ? { ...d, left: { ...d.right, stickers: [...d.right.stickers] } } : d));
              }}
            />
          </div>
        </div>
      </div>

      <PriceBar price={price} bothPainted={bothPainted} onAddToBasket={addToBasket} onSaveDesign={saveDesign} />

      {saveMsg && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: '#fff', padding: '12px 20px', border: '2px solid var(--lime)', zIndex: 300 }}>
          {saveMsg}
        </div>
      )}
    </div>
  );
}
