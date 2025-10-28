import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'FHEVM SDK',
  tagline: 'Universal SDK for building confidential dApps with Fully Homomorphic Encryption',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://0xethll.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/fhevm-sdk/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '0xethll', // Usually your GitHub org/user name.
  projectName: 'fhevm-sdk', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/0xethll/fhevm-sdk/tree/main/docs/',
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'FHEVM SDK',
      logo: {
        alt: 'FHEVM SDK Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          href: 'https://github.com/0xethll/fhevm-sdk',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@fhevmsdk/core',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/core/client',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: '@fhevmsdk/core',
              href: 'https://www.npmjs.com/package/@fhevmsdk/core',
            },
            {
              label: '@fhevmsdk/react',
              href: 'https://www.npmjs.com/package/@fhevmsdk/react',
            },
            {
              label: '@fhevmsdk/vue',
              href: 'https://www.npmjs.com/package/@fhevmsdk/vue',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/0xethll/fhevm-sdk',
            },
            {
              label: 'Zama Documentation',
              href: 'https://docs.zama.ai/',
            },
            {
              label: 'FHEVM Docs',
              href: 'https://docs.zama.ai/fhevm',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FHEVM SDK.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'bash', 'typescript', 'tsx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
