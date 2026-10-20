import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormaAlertComponent, FormaBadgeComponent } from './forma-feedback.component';

const meta: Meta<FormaBadgeComponent> = {
  title: 'Forma Angular / Feedback / Status',
  component: FormaBadgeComponent,
  decorators: [moduleMetadata({ imports: [FormaBadgeComponent, FormaAlertComponent] })],
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: '<div style="display:grid;gap:12px;max-width:440px"><forma-badge [tone]="tone" [dot]="dot">Published</forma-badge><forma-alert tone="success" title="Your changes are saved.">The new theme is ready for your team.</forma-alert></div>'
  }),
  args: { tone: 'success', dot: true },
  argTypes: { tone: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger'] } }
};

export default meta;
type Story = StoryObj<FormaBadgeComponent>;
export const Playground: Story = {};
export const AllAlertTones = {
  render: () => ({
    template: '<div style="display:grid;gap:10px;max-width:480px"><forma-alert tone="info" title="One small detail.">Review this note before publishing.</forma-alert><forma-alert tone="success" title="Your changes are saved.">The team can now use this theme.</forma-alert><forma-alert tone="warning" title="A quick check before you go.">Two color pairs need a contrast review.</forma-alert><forma-alert tone="danger" title="We couldn’t save that yet.">Check your connection and try again.</forma-alert></div>'
  })
};
