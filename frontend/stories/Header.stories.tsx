import React from 'react';
import Header from '../components/Header';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { setUser, setToken } from '../store/store';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const EnterGuest: Story = {
  name: 'Guest',
  decorators: [
    Story => {
      store.dispatch(setUser(null));
      store.dispatch(setToken(null));

      return <Story />;
    },
  ],
};

export const EnterLoggedIn: Story = {
  name: 'Logged In',
  decorators: [
    Story => {
      store.dispatch(setUser({ name: 'John Doe', email: 'john@example.com' }));
      store.dispatch(setToken('sample-token'));

      return <Story />;
    },
  ],
};
