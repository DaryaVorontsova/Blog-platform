import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import ProfilePage from '../pages/profile';
import { Provider } from 'react-redux';
import { store, setToken, setUser} from '../store/store';
import { deleteArticle, postArticle } from '../lib/api';

const meta = {
  title: 'Pages/ProfilePage',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProfilePage>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockUser = {
  id: 1,
  name: 'John',
  email: 'john@mail.ru',
};

const mockArticles = [
  {
    id:  1,
    title: 'First Article',
    content: 'This is the content of the first article.',
    previewImage: '/images/preview1.png',
  },

];

const mockComments = [
  {
    id: 1,
    content: 'This is a comment on the first article.',
  },
];

// История по умолчанию с пользователем и статьями
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
  args: {
    user: mockUser,
    articles: mockArticles,
    comments: mockComments,
  },
};

// История без статей
export const NoArticles: Story = {
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
  args: {
    user: mockUser,
    articles: [],
    comments: mockComments,
  },
};

// История без комментариев
export const NoComments: Story = {
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
  args: {
    user: mockUser,
    articles: mockArticles,
    comments: [],
  },
};

// Удаление статьи
export const ArticleDeletion: Story = {
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
  args: {
    user: mockUser,
    articles: [],
    comments: mockComments,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const formData = new FormData();
    formData.append('title', 'Тестовая статья');
    formData.append('content', 'Это содержание тестовой статьи.');
    formData.append('previewImage', new Blob(['image data'], { type: 'image/png' }));

    const createdArticle = await postArticle(formData);

    args.articles = [createdArticle]; 

    const deleteButton = await canvas.findByRole('button', { name: /delete/i });

    console.log("Id: ", createdArticle.id);
    await deleteArticle(createdArticle.id);

    await userEvent.click(deleteButton);

    await expect(deleteButton).not.toBeInTheDocument();
  },
};