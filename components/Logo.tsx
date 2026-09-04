import Link from 'next/link';
import BubbleMark from './BubbleMark';
import styles from './Logo.module.css';

type Props = {
  /** Fixed small size regardless of viewport — for contexts like the footer where the
   * logo shares a narrow column with other content, rather than owning a full header row. */
  compact?: boolean;
};

export default function Logo({ compact = false }: Props) {
  return (
    <Link href="/" className={`${styles.mark} ${compact ? styles.compact : ''}`} aria-label="BUBBLEHOPS home">
      <span className={styles.bubbles}>
        <BubbleMark size={40} fill="#fff" className={styles.bubbleBig} keylineWidth={13.5} />
      </span>
      <span className={styles.word}>
        <span className={styles.wordOutline} aria-hidden="true">BUBBLEHOPS</span>
        BUBBLEHOPS
      </span>
    </Link>
  );
}
