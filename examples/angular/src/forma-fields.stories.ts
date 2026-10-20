import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormaTextFieldComponent } from './forma-text-field.component';
import { FormaSelectComponent } from './forma-select.component';
import { FormaCheckboxComponent } from './forma-checkbox.component';
import { FormaSwitchComponent } from './forma-switch.component';

const meta: Meta<FormaTextFieldComponent> = {
  title: 'Forma Angular / Forms / Text field',
  component: FormaTextFieldComponent,
  decorators: [moduleMetadata({ imports: [FormaTextFieldComponent, FormaSelectComponent, FormaCheckboxComponent, FormaSwitchComponent] })],
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: '<forma-text-field [label]="label" [placeholder]="placeholder" [hint]="hint" [error]="error" [required]="required" [type]="type"></forma-text-field>'
  }),
  args: { label: 'Work email', placeholder: 'you@company.com', hint: 'We’ll only use this to contact you.', required: true, type: 'email' }
};

export default meta;
type Story = StoryObj<FormaTextFieldComponent>;
export const Playground: Story = {};
export const ValidationError: Story = { args: { error: 'Enter a valid work email.', hint: '', required: true } };

export const SelectionControls = {
  render: () => ({
    template: '<div style="display:grid;gap:18px;max-width:340px"><forma-checkbox label="Product updates" description="A thoughtful note when something new ships." [checked]="true"></forma-checkbox><forma-switch label="Weekly summary" description="A quick digest, every Monday." [checked]="true"></forma-switch></div>'
  })
};
