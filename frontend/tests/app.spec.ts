import { test, expect } from '@playwright/test';
import { store, setUser } from '../store/store';
import { login, postArticle } from '../lib/api';
import Cookies from 'js-cookie';

test.describe('Blog App Tests', () => {
  test.beforeEach(async ({ page }) => {
    // await page.route('**/auth/login', route => {
    //   route.fulfill({
    //     status: 200,
    //     body: JSON.stringify({ access_token: 'test-mocked-token' }),
    //   });
    // });

   
    store.dispatch(setUser({
      id: 1,
      name: 'Test_User_1234',
      email: 'test_user1234@example.com',
    }));
  });

  test('1. Register New User', async ({ page }) => {
    await page.route('**/users/register', route => {
      route.fulfill({
        status: 201,
        body: JSON.stringify({ access_token: 'mocked-token' }),
      });
    });
    await page.goto('/register');
    await page.getByLabel('Name').fill('Test1234 User');
    await page.getByLabel('Email').fill('testuser1234@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('2. Login with Valid Credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('testuser1234@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome to the Blog!')).toBeVisible();
  });

  test('3. Create a New Article', async ({ page }) => {
    // await page.route('**/articles', route => {
    //   route.fulfill({
    //     status: 201,
    //     body: JSON.stringify({ message: 'Article created successfully!' }),
    //   });
    // });

    await page.goto('/login');
    const token = await login("test_user1234@example.com", "qwerty1234");
    await page.context().addCookies([
      { name: 'jwt', value: token, url: 'http://localhost:3000' },
    ]);

    await page.getByLabel('Email').fill('test_user1234@example.com');
    await page.getByLabel('Password').fill('qwerty1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/createArticle');

    await page.getByLabel('Title').fill('Test Article');
    await page
      .getByLabel('Content')
      .fill('This is the content.');
    await page.getByRole('button', { name: 'Create Article' }).click();
    await expect(page).toHaveURL('/profile');
  });

  test('4. Check Profile Page and Delete Article', async ({ page }) => {
    // await page.route('**/articles', route => {
    //   route.fulfill({
    //     status: 200,
    //     body: JSON.stringify([
    //       {
    //         id: 1,
    //         title: 'Test Article',
    //         content: 'lalala',
    //       },
    //     ]),
    //   });
    // });

    // await page.route('**/articles/1', route => {
    //   route.fulfill({
    //     status: 200,
    //     body: JSON.stringify({ message: 'Article deleted successfully.' }),
    //   });
    // });

    await page.goto('/login');
    const token = await login("test_user1234@example.com", "qwerty1234");
    await page.context().addCookies([
      { name: 'jwt', value: token, url: 'http://localhost:3000' },
    ]);

    await page.getByLabel('Email').fill('test_user1234@example.com');
    await page.getByLabel('Password').fill('qwerty1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/');    

    await page.goto('/profile');

    await expect(page.locator('text=Test Article')).toBeVisible();

    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.locator('text=Test Article')).not.toBeVisible();
  });

  test('5. Redirect to Login when No Token is Found', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/profile');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});
