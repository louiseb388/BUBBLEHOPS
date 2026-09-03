import Link from 'next/link';
import BubbleMark from './BubbleMark';
import styles from './Logo.module.css';

export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className={styles.mark} aria-label="BUBBLEHOPS home">
      <span className={`${styles.bubbles} ${small ? styles.bubblesSm : ''}`}>
        <BubbleMark size={small ? 24 : 40} className={styles.bubbleBig} />
        <BubbleMark size={small ? 14 : 22} className={styles.bubbleSmall} />
      </span>
      <span className={`${styles.word} ${small ? styles.wordSm : ''}`}>
        BUBBLEHOPS
        <span className={styles.wordHighlight} aria-hidden="true">BUBBLEHOPS</span>
      </span>
    </Link>
  );
}
