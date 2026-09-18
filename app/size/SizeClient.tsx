'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBase, SIZES } from '@/lib/data';
import { useStock, isSoldOut } from '@/lib/inventory';
import FlowProgress from '@/components/FlowProgress';
import SizeQtyPicker from '@/components/SizeQtyPicker';

export default function SizeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { stock } = useStock();

  const baseId = searchParams.get('base') || '';
  const base = getBase(baseId);

  const sizeParam = searchParams.get('size');
  const qtyParam = Number(searchParams.get('qty'));
  const [size, setSize] = useState<string | null>(sizeParam && SIZES.includes(sizeParam) ? sizeParam : null);
  const [qty, setQty] = useState(qtyParam > 0 ? Math.min(9, Math.round(qtyParam)) : 1);

  if (!base || isSoldOut(stock, baseId)) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="h-display h1" style={{ marginBottom: 20 }}>Pick a trainer first.</h1>
        <p className="lede" style={{ marginBottom: 32 }}>
          {baseId ? "That base isn't available right now." : "Choose a base trainer to see sizes for it."}
        </p>
        <Link href="/base-trainers" className="btn btn-lime">Base trainers</Link>
      </div>
    );
  }

  function goToDesign() {
    if (!size) return;
    router.push(`/create-your-own?base=${base!.id}&size=${encodeURIComponent(size)}&qty=${qty}`);
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 720 }}>
      <p className="eyebrow">Base trainers</p>
      <h1 className="h-display h1" style={{ marginBottom: 32 }}>Pick a size.</h1>

      <FlowProgress step="size" />

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base.img}
          alt={base.name}
          style={{ width: 88, height: 88, objectFit: 'cover', border: '2px solid var(--ink)' }}
        />
        <div>
          <p style={{ margin: 0, fontWeight: 800 }}>{base.name}</p>
          <p className="body-text" style={{ margin: 0 }}>From £{base.price}</p>
        </div>
      </div>

      <SizeQtyPicker baseId={base.id} size={size} qty={qty} onSizeChange={setSize} onQtyChange={setQty} />

      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '20px 0 24px' }}>
        Kids&rsquo; UK sizes. If they&rsquo;re between sizes, we recommend going up.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/base-trainers" className="btn btn-outline">Back</Link>
        <button className="btn btn-lime" disabled={!size} onClick={goToDesign}>
          Continue to design
        </button>
      </div>
    </div>
  );
}
