import type { StorybookConfig } from '@storybook/react-vite';

/**
 * The React Storybook for Forma, by Lulamile Mkhungela.
 * It tells the same story as the guide: the real components, the real tokens, the real CSS.
 */
const config: StorybookConfig = {
  stories: ['../src/system/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  staticDirs: ['../public']
};

export default config;
