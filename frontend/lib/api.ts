import axios from 'axios';
import Cookies from 'js-cookie';
import type { UserProfile } from '../types/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const token = response.data.access_token;

  Cookies.set('jwt', token, { expires: 1 });

  return token;
};

export const logout = async () => {
  Cookies.remove('jwt');
};

export const getUserProfile = async (token: string) => {
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(response.data);

  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  const response = await api.post('/users/register', { email, password, name });

  return response.data;
};

interface Article {
  id: number;
  title: string;
  content: string;
  previewImage: string;
  author: UserProfile;
}

interface Comment {
  id: number;
  content: string;
  author: UserProfile;
}

export const getUserArticles = async (userId: number): Promise<Article[]> => {
  const response = await api.get(`/articles`);
  const allArticles = response.data.data;

  return allArticles.filter((article: Article) => article.author.id === userId);
};

export const getUserComments = async (userId: number): Promise<Comment[]> => {
  const response = await api.get(`/comments`);
  const allComments = response.data.data;

  return allComments.filter((comment: Comment) => comment.author.id === userId);
};

export const postArticle = async (formdata: FormData) => {
  const token = Cookies.get('jwt');

  console.log(formdata);

  const response = await api.post('/articles', formdata, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteArticle = async (articleId: number) => {
  const token = Cookies.get('jwt');

  await api.delete(`/articles/${articleId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;
