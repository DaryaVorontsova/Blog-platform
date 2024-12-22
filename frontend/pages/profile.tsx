import type { GetServerSideProps } from 'next';
import cookie from 'cookie';
import { wrapper } from '../store/store';
import { setUser } from '../store/store';
import {
  getUserArticles,
  getUserProfile,
  getUserComments,
  deleteArticle,
} from '../lib/api';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

import type { UserProfile } from '../types/types';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

interface Article {
  id: number;
  title: string;
  content: string;
  previewImage: string | null;
}

interface Comment {
  id: number;
  content: string;
}

interface ProfilePageProps {
  user: UserProfile;
  articles: Article[];
  comments: Comment[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  articles,
  comments,
}) => {
  const router = useRouter();
  const [userArticles, setUserArticles] = useState<Article[]>(articles);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleDelete = useCallback(async (articleId: number) => {
    try {
      await deleteArticle(articleId);
      setUserArticles(prevArticles =>
        prevArticles.filter(article => article.id !== articleId),
      );
      alert('Article deleted successfully.');
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete the article.');
    }
  }, []);

  return (
    <div>
      <Header />
      <BackButton fallbackPath="/" label="Back to home" />
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Profile of {user ? user.name : 'Guest'}
        </Typography>

        <section style={{ marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Your Articles
          </Typography>
          {userArticles.length > 0 ? (
            <Grid container spacing={2}>
              {userArticles.map(article => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Paper elevation={2} style={{ padding: '16px' }}>
                    <Typography variant="h6">{article.title}</Typography>
                    {article.previewImage && (
                      <Image
                        src={`http://localhost:3001${article.previewImage}`}
                        alt="Preview"
                        width={100}
                        height={100}
                        style={{ marginTop: '10px', borderRadius: '10px' }}
                        priority
                      />
                    )}
                    <Typography variant="body2" color="textSecondary">
                      {article.content}
                    </Typography>
                  </Paper>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(article.id)}
                    style={{ margin: '10px' }}
                  >
                    Delete
                  </Button>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1">No articles found.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/createArticle')}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            Create new article
          </Button>
        </section>

        <section style={{ marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Your Comments
          </Typography>
          {comments.length > 0 ? (
            comments.map(comment => (
              <Paper
                key={comment.id}
                style={{ marginBottom: '16px', padding: '16px' }}
              >
                <Typography variant="body1">{comment.content}</Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1">No comments found.</Typography>
          )}
        </section>
      </Container>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(store => async ({ req }) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.jwt;

    if (!token) {
      console.log('No JWT token found, redirecting to login.');

      return { redirect: { destination: '/login', permanent: false } };
    }

    try {
      const user = await getUserProfile(token);
      const articles = await getUserArticles(user.id);
      const comments = await getUserComments(user.id);

      store.dispatch(setUser(user));

      return { props: { user, articles, comments } };
    } catch (error) {
      console.error('Failed to fetch profile data:', error);

      return { props: { user: null, articles: [], comments: [] } };
    }
  });

export default ProfilePage;
