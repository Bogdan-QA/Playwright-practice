// tests/demowebshop.spec.js
import { test , expect} from '@playwright/test';
import { DemoWebShopHomePage } from '../pages/DemoWebShopObjects/DemoWebShopHomePage';
import { RegistrationPage } from '../pages/DemoWebShopObjects/RegistrationPage';
import testData from '../data/testData.json';

test.describe('Demo Web Shop UI Tests', () => {
  let demoWebShopHomePage;
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    demoWebShopHomePage = new DemoWebShopHomePage(page);
    registrationPage = new RegistrationPage(page);
    await demoWebShopHomePage.open();
  });

  test('Verify that allows register a User', async () => {
    await demoWebShopHomePage.registerUser.click();
    await registrationPage.registerUser(testData.registrationData);
    await expect(registrationPage.registrationMessage).toBeVisible();
    const message = await registrationPage.getRegistrationMessage();
    expect(message).toContain(testData.successfullRegistrationMessage);
  });

  test('Verify that allows a user to login', async () => {
    await demoWebShopHomePage.loginUser.click();
    await registrationPage.loginUser(testData.loginData);
    const message = await demoWebShopHomePage.getAccountEmail();
    expect(message).toContain(testData.loginData.email);
  });
});
