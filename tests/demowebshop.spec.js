// tests/demowebshop.spec.js
import { test } from '@playwright/test';
import { DemoWebShopHomePage } from '../pages/DemoWebShopObjects/DemoWebShopHomePage';
import { RegistraionPage } from '../pages/DemoWebShopObjects/RegistrationPage';

test.describe('Demo Web Shop UI Tests', () => {
  let demoWebShopHomePage;
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    demoWebShopHomePage = new DemoWebShopHomePage(page);
    registrationPage = new RegistraionPage(page);
    await demoWebShopHomePage.open();
  });

  test.only('Verify that allows register a User', async () => {
    await demoWebShopHomePage.registerUser.click();
    await registrationPage.registerUser({
      firstName: 'testFirstName',
      lastName: 'testLastName',
      email: 'someEmail@example.com',
      password: 'test123',
      confirmPassword: 'test123'
    });
    await demoWebShopHomePage.page.waitForTimeout(3000);
    
  });

  test('Verify adding an item to the Wishlist', async () => {
    await demoWebShopHomePage.addItemToWishlist();
    // Further verification can be added
  });
});
