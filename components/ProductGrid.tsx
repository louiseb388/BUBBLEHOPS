'use client';

import { BASES_IN_STOCK } from '@/lib/data';
import { useStock } from '@/lib/inventory';
import BaseTrainerCard from './BaseTrainerCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ ids }: { ids?: string[] }) {
  const { stock } = useStock();
  const bases = ids ? BASES_IN_STOCK.filter((b) => ids.includes(b.id)) : BASES_IN_STOCK;

  return (
    <div className={styles.grid}>
      {bases.map((base) => (
        <BaseTrainerCard key={base.id} base={base} stock={stock} />
      ))}
    </div>
  );
}
