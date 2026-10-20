import type { Preview } from '@storybook/react-vite';
import '../src/styles/global.css';
import '../src/styles/reference-theme.css';

/**
 * Stories render inside the same shell and token surface as the guide, so what you see in
 * Storybook is what ships. The Light / Dark toolbar toggle flips the semantic theme tokens.
 */
const preview: Preview = {
  parameters: {
    layout: 'padded',
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
  },
  globalTypes: {
    theme: {
      description: 'Forma semantic theme mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintdrop',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => (
      <div
        className="app-shell"
        data-theme={context.globals.theme === 'dark' ? 'dark' : 'light'}
        style={{ minHeight: 0, padding: 24 }}
      >
        <Story />
      </div>
    )
  ]
};

export default preview;
