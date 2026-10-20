import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField, TextAreaField, SelectField } from './components';

const textFieldMeta = {
  title: 'Forma / Forms / Text field',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Work email',
    placeholder: 'you@company.com',
    hint: 'We will only use this to contact you about your workspace.',
    required: true,
    type: 'email'
  }
} satisfies Meta<typeof TextField>;

export default textFieldMeta;
type Story = StoryObj<typeof textFieldMeta>;

export const Playground: Story = {};
export const Error: Story = { args: { error: 'Enter a valid work email.', hint: undefined, defaultValue: 'not-an-email' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'hello@forma.design' } };

export const TextArea = {
  render: () => <TextAreaField label="Project details" placeholder="Tell us what you're building..." rows={4} hint="A sentence or two is perfect." />
};

export const Select = {
  render: () => <SelectField label="Team size" placeholder="Select a range" options={[
    { value: '1-5', label: '1–5 people' },
    { value: '6-20', label: '6–20 people' },
    { value: '21+', label: '21+ people' }
  ]} hint="You can change this at any time." />
};
