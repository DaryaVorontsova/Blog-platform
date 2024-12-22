import type { Meta, StoryObj } from '@storybook/react';
import HomePage from '../pages/index';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { setUser } from '../store/store';
import type { UserProfile } from '../types/types';

const meta = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomePage>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockUser: UserProfile = {
  id: 1,
  name: 'John',
  email: 'john@mail.ru',
};

// Авторизированный пользователь
export const AuthenticatedUser: Story = {
  decorators: [
    Story => {
      store.dispatch(setUser(mockUser));

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  args: {
    user: mockUser,
  },
};

// Неавторизованный пользователь
export const UnauthenticatedUser: Story = {
  decorators: [
    Story => {
      store.dispatch(setUser(null));

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  args: {
    user: null,
  },
};
