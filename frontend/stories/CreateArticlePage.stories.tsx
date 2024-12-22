import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import CreateArticlePage from '../pages/createArticle';
import { Provider } from 'react-redux';
import { store, setToken, setUser } from '../store/store';

const meta = {
  title: 'Pages/CreateArticlePage',
  component: CreateArticlePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CreateArticlePage>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockUser = {
  id: 1,
  name: 'John',
  email: 'john@mail.ru',
};

export const Default: Story = {
  decorators: [
    Story => {
      store.dispatch(setUser(mockUser));
      store.dispatch(setToken('mock-token'));

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

// Сценарий для заполнения формы и отправки
export const FilledForm: Story = {
  decorators: [
    Story => {
      store.dispatch(setUser(mockUser));
      store.dispatch(setToken('mock-token'));

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const titleInput = canvas.getByLabelText(/title/i);
    const contentInput = canvas.getByLabelText(/content/i);
    const fileInput = canvas.getByLabelText(/choose file/i);
    const submitButton = canvas.getByRole('button', {
      name: /create article/i,
    });

    await userEvent.type(titleInput, 'My First Article');
    await userEvent.type(
      contentInput,
      'This is the content of my first article.',
    );

    const file = new File(['(⌐□_□)'], 'image.png', { type: 'image/png' });

    await userEvent.upload(fileInput, file);

    await userEvent.click(submitButton);
  },
};
