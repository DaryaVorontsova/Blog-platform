import BackButton from '../components/BackButton';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  args: {
    fallbackPath: '/',
    label: 'Back',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: 'Back to home',
  },
};

export const DifferentPath: Story = {
  args: {
    fallbackPath: '/profile',
    label: 'Back to profile',
  },
};
