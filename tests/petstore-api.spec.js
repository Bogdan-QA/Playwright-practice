// tests/petstore-api.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe('Pet Store API Tests', () => {
  test('Verify that allows creating a User', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/user`, {
      data: { username: 'testuser', firstName: 'Test', lastName: 'User' },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('Verify that allows login as a User', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/user/login`, {
      params: { username: 'testuser', password: 'testpass' },
    });
    expect(response.ok()).toBeTruthy();
  });

  test('Verify that allows adding a new Pet', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/pet`, {
      data: { name: 'Fluffy', status: 'available' },
    });
    expect(response.ok()).toBeTruthy();
  });
});
