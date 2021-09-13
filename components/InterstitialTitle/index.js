import Wrapper from 'components/Wrapper';
import styles from './style.module.css';
import { containsKeywords } from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';

export default function InterstitialTitle({
  style = 'one',
  children,
  kicker,
  subtitle,
  seoAnalysis,
}) {
  let Title;
  let Subtitle;
  let Kicker;

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);

    Kicker = kickerContainsKeywords ? 'h2' : 'h3';
    Title = kicker && kickerContainsKeywords ? 'h3' : 'h2';
    Subtitle =
      subtitle && containsKeywords(subtitle, seoAnalysis) ? 'h4' : 'h6';
  } else {
    Kicker = 'h2';
    Title = 'h3';
    Subtitle = 'div';
  }

  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && (
          <Heading
            as={Kicker}
            className={styles.kicker}
            anchor={slugify(kicker)}
          >
            {kicker}
          </Heading>
        )}
        <div className={styles[style]}>
          <Title className={styles.title}>{children}</Title>
        </div>
        {subtitle && (
          <Subtitle className={styles.subtitle}>{subtitle}</Subtitle>
        )}
      </div>
    </Wrapper>
  );
}
