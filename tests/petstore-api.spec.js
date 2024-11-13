// tests/petstore-api.spec.js
import { test, expect } from '@playwright/test';
import testData from '../data/testData.json';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe.serial('Pet Store API Tests for users', () => {

  test('Verify that allows creating a User', async ({ request }) => {

    // Read user data from the JSON file
    const { userCreationData } = testData;

    // Make the POST request to create a user
    const response = await request.post(`${BASE_URL}/user`, {
      data: userCreationData
    });

    // Validate the response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Fetch the created user details using the username
    const getUserResponse = await request.get(`${BASE_URL}/user/${userCreationData.username}`);
    expect(getUserResponse.ok()).toBeTruthy();
    expect(getUserResponse.status()).toBe(200);

    // Log the user details response
    const userDetails = await getUserResponse.json();

    // Validate the user details
    expect(userDetails.username).toBe(userCreationData.username);
    expect(userDetails.firstName).toBe(userCreationData.firstName);
    expect(userDetails.lastName).toBe(userCreationData.lastName);
  });

  test('Verify that allows login as a User', async ({ request }) => {
    // Read user data from the JSON file
  const { userCreationData } = testData;

  // Perform login request
  const loginResponse = await request.get(`${BASE_URL}/user/login`, {
    params: {
      username: userCreationData.username,
      password: userCreationData.password,
    },
  });

  // Validate the response status
  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  // Parse and log the response body
  const loginResponseBody = await loginResponse.json();
  console.log('Login Response Body:', loginResponseBody);

  // Validate the response contains expected values
  expect(loginResponseBody.message).toContain('logged in');
    
  });

  test('Verify that allows logging out the User', async ({ request }) => {
    // Perform logout request
    const logoutResponse = await request.get(`${BASE_URL}/user/logout`, {
      headers: {
        accept: 'application/json',
      },
    });
  
    // Validate the response status
    expect(logoutResponse.ok()).toBeTruthy();
    expect(logoutResponse.status()).toBe(200);
  
    // Parse and validate the response body
    const logoutResponseBody = await logoutResponse.json();
    console.log('Logout Response Body:', logoutResponseBody);
  
    // Verify the response body contains expected data
    expect(logoutResponseBody.code).toBe(200);
    expect(logoutResponseBody.message).toBe('ok');
  });

  test('Verify that allows creating the list of Users', async ({ request }) => {
   // Use the userList data from the testData file
   const userList = testData.userList;

   const response = await request.post(`${BASE_URL}/user/createWithList`, {
     data: userList,
   });

   expect(response.ok()).toBeTruthy();

   // Verify the response status code
   const responseBody = await response.json();
   console.log('Response Body:', responseBody);
   expect(responseBody.code).toBe(200);
   expect(responseBody.message).toBe('ok');
  });
});

test.describe.serial('Pet Store API Tests for pets', () => {

  test('Verify that allows adding a new Pet', async ({ request }) => {
    const petData = testData.petData;

    const response = await request.post(`${BASE_URL}/pet`, {
      data: petData
    });

    // Assert response is OK
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    // Verify response body
    expect(responseBody.id).toBe(petData.id);
    expect(responseBody.name).toBe(petData.name);
    expect(responseBody.status).toBe(petData.status);
  });

  test('Verify that allows updating Pet’s name and status', async ({ request }) => {
    const petId = testData.petData.id;
    const updateData = {
      ...testData.petData,
      name: testData.updatePetData.name,
      status: testData.updatePetData.status
    };

    // Update the pet using PUT request
    const response = await request.put(`${BASE_URL}/pet`, {
      data: updateData
    });

    // Assert response is OK
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    // Verify updated data
    expect(responseBody.id).toBe(petId);
    expect(responseBody.name).toBe(updateData.name);
    expect(responseBody.status).toBe(updateData.status);
  });

  test('Verify that allows deleting Pet', async ({ request }) => {
    const petId = testData.petData.id;

    // Delete the pet using DELETE request
    const deleteResponse = await request.delete(`${BASE_URL}/pet/${petId}`);

    // Assert response is OK
    expect(deleteResponse.ok()).toBeTruthy();

    const deleteResponseBody = await deleteResponse.json();

    // Verify the response confirms deletion
    expect(deleteResponseBody.code).toBe(200);
    expect(deleteResponseBody.message).toBe(String(petId));
  });

  test('Verify that the Pet is no longer available via GET', async ({ request }) => {
    const petId = testData.petData.id;

    // Try to retrieve the deleted pet using GET request
    const getResponse = await request.get(`${BASE_URL}/pet/${petId}`);

    // Assert response returns a 404 status
    expect(getResponse.status()).toBe(404);

    const getResponseBody = await getResponse.json();

    // Verify the response indicates the pet is not found
    expect(getResponseBody.code).toBe(1);
    expect(getResponseBody.type).toBe('error');
    expect(getResponseBody.message).toBe('Pet not found');
  });
});