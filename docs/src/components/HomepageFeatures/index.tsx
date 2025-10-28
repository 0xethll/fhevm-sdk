import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fully Confidential',
    icon: '🔐',
    description: (
      <>
        Build dApps where sensitive data remains encrypted on-chain.
        Perform computations on encrypted values without ever revealing them.
        Privacy-preserving by design.
      </>
    ),
    link: '/docs',
  },
  {
    title: 'Works Everywhere',
    icon: '⚛️',
    description: (
      <>
        Use with React, Vue, or vanilla JavaScript. One SDK, multiple frameworks
        with consistent APIs. Framework-agnostic core with specialized bindings.
      </>
    ),
    link: '/docs/getting-started/installation',
  },
  {
    title: 'Production Ready',
    icon: '🚀',
    description: (
      <>
        Built on Zama's proven FHE technology. Type-safe, well-documented,
        and optimized for real-world applications. Battle-tested in production.
      </>
    ),
    link: '/docs/api-reference/core/client',
  },
];

function Feature({title, icon, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureCard}>
        <div className={styles.featureIcon}>
          <span role="img" aria-label={title}>{icon}</span>
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
          <span className={styles.featureLink}>
            Learn more →
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2">Why FHEVM SDK?</Heading>
          <p>Everything you need to build privacy-preserving decentralized applications</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
