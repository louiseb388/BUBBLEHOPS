import Link from 'next/link';
import BubbleMark from './BubbleMark';
import styles from './Logo.module.css';

export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={styles.mark} aria-label="BUBBLEHOPS home">
      <span className={styles.bubbles}>
        <BubbleMark size={small ? 24 : 30} className={styles.bubbleBig} />
        <BubbleMark size={small ? 14 : 18} className={styles.bubbleSmall} />
      </span>
      <span className={`${styles.word} ${small ? styles.wordSm : ''}`}>
        BUBBLEHOPS
        <span className={styles.wordHighlight} aria-hidden="true">BUBBLEHOPS</span>
      </span>
    </Link>
  );
}
