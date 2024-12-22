import type { GetServerSideProps } from 'next';
import cookie from 'cookie';
import { useState, useCallback } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { getUserProfile, postArticle } from '../lib/api';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

const CreateArticlePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append('title', title);
      formData.append('content', content);

      if (previewImage) {
        formData.append('previewImage', previewImage);
      }

      try {
        await postArticle(formData);
        alert('Article created successfully!');
        router.push('/profile');
      } catch (error) {
        console.error('Failed to create article:', error);
        alert('Failed to create article.');
      }
    },
    [title, content, previewImage, router],
  );

  return (
    <div>
      <Header />
      <BackButton fallbackPath="/profile" label="Back to profile" />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Create New Article
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={e =>
              setPreviewImage((e.target as HTMLInputElement).files?.[0] || null)
            }
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              style={{ margin: '16px' }}
            >
              Choose File
            </Button>
          </label>
          <Button variant="contained" color="primary" type="submit">
            Create Article
          </Button>
        </form>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.jwt;

  if (!token) {
    console.log('No JWT token found, redirecting to login.');

    return { redirect: { destination: '/login', permanent: false } };
  }

  try {
    await getUserProfile(token);

    return { props: {} };
  } catch (error) {
    console.error('Failed to fetch profile data:', error);

    return { redirect: { destination: '/login', permanent: false } };
  }
};

export default CreateArticlePage;
