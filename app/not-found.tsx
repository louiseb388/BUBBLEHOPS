import Link from 'next/link';
import BubbleMark from '@/components/BubbleMark';

export default function NotFound() {
  return (
    <div style={{ background: 'var(--ink)', color: '#fff', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          <BubbleMark size={56} />
          <BubbleMark size={32} mark={false} />
        </div>
        <h1 className="h-display h1" style={{ color: '#fff', marginBottom: 16 }}>This one&apos;s not painted yet.</h1>
        <p className="lede" style={{ color: 'rgba(255,255,255,0.75)', margin: '0 auto 32px' }}>
          That page doesn&apos;t exist — but here&apos;s where you probably meant to go.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          <Link href="/create-your-own" className="btn btn-lime">Create your own</Link>
          <Link href="/" className="btn btn-outline-white">Home</Link>
          <Link href="/base-trainers" className="btn btn-outline-white">Base trainers</Link>
          <Link href="/sizing-and-care" className="btn btn-outline-white">Sizing & care</Link>
          <Link href="/contact" className="btn btn-outline-white">Contact</Link>
        </div>
      </div>
    </div>
  );
}
