import Link from 'next/link';
import BubbleMark from './BubbleMark';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <Link href="/" className={styles.mark} aria-label="BUBBLEHOPS home">
      <span className={styles.bubbles}>
        <BubbleMark size={40} className={styles.bubbleBig} />
        <BubbleMark size={22} mark={false} className={styles.bubbleSmall} />
      </span>
      <span className={styles.word}>
        <span className={styles.wordOutline} aria-hidden="true">BUBBLEHOPS</span>
        BUBBLEHOPS
      </span>
    </Link>
  );
}
