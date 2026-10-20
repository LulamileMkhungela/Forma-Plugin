import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: {
      default: 'Forma canvas',
      values: [
        { name: 'Forma canvas', value: '#F3F5F1' },
        { name: 'Surface', value: '#FAFBF9' },
        { name: 'Forest night', value: '#131B11' }
      ]
    },
    a11y: { test: 'error' }
  }
};

export default preview;
