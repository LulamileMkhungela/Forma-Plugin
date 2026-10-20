import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormaButtonComponent } from './forma-button.component';

const meta: Meta<FormaButtonComponent> = {
  title: 'Forma Angular / Actions / Button',
  component: FormaButtonComponent,
  decorators: [moduleMetadata({ imports: [FormaButtonComponent] })],
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: '<forma-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Create account</forma-button>'
  }),
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger', 'quiet'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export default meta;
type Story = StoryObj<FormaButtonComponent>;

export const Playground: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', size: 'md' } };
export const Loading: Story = { args: { variant: 'primary', loading: true } };
export const AllVariants: Story = {
  render: () => ({
    template: '<div style="display:flex;gap:10px;flex-wrap:wrap"><forma-button variant="primary">Primary</forma-button><forma-button variant="secondary">Secondary</forma-button><forma-button variant="tertiary">Tertiary</forma-button><forma-button variant="danger">Danger</forma-button></div>'
  })
};
