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
import ShoeStage, { MAX_STICKERS } from './ShoeStage';
import ShoeControls from './ShoeControls';
import Toolbar from './Toolbar';
import PriceBar from './PriceBar';
import styles from './Designer.module.css';

const STORAGE_KEY = 'bubblehops_design';
const HISTORY_LIMIT = 5;
const SAMPLE_WORDS = ['ARLO', 'MILO', 'ZARA', 'REX', 'IVY', 'FINN', 'NOVA', 'JAX'];

function randomSticker() {
  return {
    id: `st_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    x: 30 + Math.random() * 40,
    y: 35 + Math.random() * 30,
    scale: 1 + Math.floor(Math.random() * 5) * 0.1, // current size is the smallest; up to 5 sizes, each 10% bigger
    rot: Math.round(Math.random() * 360)
  };
}

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
    const colourPool = WORD_COLOURS.filter((c) => c.id !== 'grey');
    const randomSide = (): Side => ({
      blank: false,
      word: SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)],
      colour: colourPool[Math.floor(Math.random() * colourPool.length)].id,
      outline: Math.random() > 0.2 ? WORD_COLOURS[Math.floor(Math.random() * WORD_COLOURS.length)].id : 'none',
      font: 'graffiti',
      size: 1.2 + Math.random() * 0.4,
      rot: Math.round((Math.random() - 0.5) * 40),
      x: 40 + Math.random() * 20,
      y: 40 + Math.random() * 20,
      stickers: Math.random() > 0.5 ? [randomSticker()] : []
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

  function renderStage(which: 'left' | 'right') {
    const side = design![which];
    return (
      <ShoeStage
        base={base!}
        side={side}
        which={which}
        active={activeSide === which}
        onFocus={() => setActiveSide(which)}
        onMoveWord={(x, y) => {
          patchSide(which, { x, y });
        }}
        onMoveSticker={(id, x, y) => {
          setDesign((d) =>
            d ? { ...d, [which]: { ...d[which], stickers: d[which].stickers.map((s) => (s.id === id ? { ...s, x, y } : s)) } } : d
          );
        }}
        onAddSticker={() => {
          beginChange();
          setDesign((d) => {
            if (!d || d[which].stickers.length >= MAX_STICKERS) return d;
            return { ...d, [which]: { ...d[which], stickers: [...d[which].stickers, randomSticker()] } };
          });
        }}
        onRemoveSticker={(id) => {
          beginChange();
          setDesign((d) => (d ? { ...d, [which]: { ...d[which], stickers: d[which].stickers.filter((s) => s.id !== id) } } : d));
        }}
        onSurpriseMe={surpriseMe}
      />
    );
  }

  function renderActions(which: 'left' | 'right') {
    const side = design![which];
    const other = which === 'left' ? 'right' : 'left';
    const label = which === 'left' ? 'Left' : 'Right';
    return (
      <div className={styles.actionBarCol}>
        <span className={styles.actionBarLabel}>{label} shoe · Outer side</span>
        <div className={styles.actionBarBtns}>
          <button
            className={`btn btn-outline-white btn-sm ${side.blank ? styles.actionBarActive : ''}`}
            onClick={() => {
              beginChange();
              const nextBlank = !side.blank;
              patchSide(which, nextBlank ? { blank: true, stickers: [] } : { blank: false });
            }}
          >
            Leave blank
          </button>
          <button
            className="btn btn-outline-white btn-sm"
            onClick={() => {
              beginChange();
              patchSide(which, { x: 50, y: 50, stickers: [] });
            }}
          >
            Reset
          </button>
          <button
            className="btn btn-outline-white btn-sm"
            onClick={() => {
              beginChange();
              setDesign((d) => (d ? { ...d, [other]: { ...side, stickers: [...side.stickers] } } : d));
            }}
          >
            Copy to {other}
          </button>
          <button className="btn btn-outline-white btn-sm" onClick={undo} disabled={undoStack.current.length === 0} aria-label="Undo">
            ↺
          </button>
          <button className="btn btn-outline-white btn-sm" onClick={redo} disabled={redoStack.current.length === 0} aria-label="Redo">
            ↻
          </button>
        </div>
      </div>
    );
  }

  function renderControls(which: 'left' | 'right') {
    const label = which === 'left' ? 'Left' : 'Right';
    return (
      <div>
        <ShoeControls label={label} side={design![which]} onBeginChange={beginChange} onChange={(patch) => patchSide(which, patch)} />
      </div>
    );
  }

  return (
    <div>
      <Toolbar
        bothPainted={bothPainted}
        stock={stock}
        onPickBase={pickBase}
      />

      {/* Desktop: grouped by section (both shoes, then both action bars, then both control panels) so the
          three bands each stay one continuous full-width strip. Hidden below 720px in favour of the
          per-shoe layout, where the same components render again grouped by shoe instead. */}
      <div className={styles.desktopOnly}>
        <div className={styles.stageWrap}>
          <div className={styles.stageGrid}>
            {renderStage('left')}
            {renderStage('right')}
          </div>
          <p className={styles.disclaimer}>* A preview, not the finished pair — we hand-letter every word.</p>
        </div>

        <div className={styles.actionBar}>
          <div className={styles.actionBarGrid}>
            {renderActions('left')}
            {renderActions('right')}
          </div>
        </div>

        <div className={styles.controlsWrap}>
          <div className={styles.controlsGrid}>
            {renderControls('left')}
            {renderControls('right')}
          </div>
        </div>
      </div>

      {/* Mobile: grouped by shoe, so a shoe's own customisation controls sit right below it. */}
      <div className={styles.mobileOnly}>
        <p className={styles.disclaimerMobile}>* A preview, not the finished pair — we hand-letter every word.</p>

        <div className={styles.stageWrap}>
          <div className={styles.stageGrid}>{renderStage('left')}</div>
        </div>
        <div className={styles.actionBar}>
          <div className={styles.actionBarGrid}>{renderActions('left')}</div>
        </div>
        <div className={styles.controlsWrap}>
          <div className={styles.controlsGrid}>{renderControls('left')}</div>
        </div>

        <div className={styles.stageWrap}>
          <div className={styles.stageGrid}>{renderStage('right')}</div>
        </div>
        <div className={styles.actionBar}>
          <div className={styles.actionBarGrid}>{renderActions('right')}</div>
        </div>
        <div className={styles.controlsWrap}>
          <div className={styles.controlsGrid}>{renderControls('right')}</div>
        </div>
      </div>

      <PriceBar
        price={price}
        bothPainted={bothPainted}
        baseName={base.name}
        onAddToBasket={addToBasket}
        onSaveDesign={saveDesign}
        onShareDesign={shareDesign}
      />

      {saveMsg && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: '#fff', padding: '12px 20px', border: '2px solid var(--lime)', zIndex: 300 }}>
          {saveMsg}
        </div>
      )}
    </div>
  );
}
