import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start-react',
        'getting-started/quick-start-vue',
        'getting-started/quick-start-vanilla',
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/nextjs-example',
        'examples/vite-react-example',
        'examples/vite-vue-example',
      ],
    },
    'troubleshooting',
  ],

  apiSidebar: [
    {
      type: 'category',
      label: '@fhevmsdk/core',
      collapsed: false,
      items: [
        'api-reference/core/client',
        'api-reference/core/encrypt',
        'api-reference/core/decrypt',
        'api-reference/core/config',
        'api-reference/core/utils',
      ],
    },
    {
      type: 'category',
      label: '@fhevmsdk/react',
      collapsed: false,
      items: [
        'api-reference/react/provider',
        'api-reference/react/use-fhevm',
        'api-reference/react/use-encrypt',
        'api-reference/react/use-decrypt',
        'api-reference/react/use-confidential-balance',
        'api-reference/react/use-confidential-transfer',
      ],
    },
    {
      type: 'category',
      label: '@fhevmsdk/vue',
      collapsed: false,
      items: [
        'api-reference/vue/setup',
        'api-reference/vue/use-fhevm',
        'api-reference/vue/use-encrypt',
        'api-reference/vue/use-decrypt',
        'api-reference/vue/use-confidential-balance',
        'api-reference/vue/use-confidential-transfer',
      ],
    },
  ],

  guidesSidebar: [
    'guides/nextjs-integration',
    'guides/vite-integration',
    'guides/network-configuration',
    'guides/error-handling',
    'guides/best-practices',
  ],
};

export default sidebars;
