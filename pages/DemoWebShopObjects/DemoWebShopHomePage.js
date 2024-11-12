import { expect } from '@playwright/test';

export class DemoWebShopHomePage {
  constructor(page) {
    this.page = page;
    this.registerUser = page.locator('.ico-register');
    this.loginUser = page.locator('.ico-login');
    this.loggedInAccount = page.locator('.account').first();
  }

  async open() {
    await this.page.goto('https://demowebshop.tricentis.com/');
  }

  async getAccountEmail() {
    return await this.loggedInAccount.textContent();
  }

  async verifyComputersSubcategories(expectedSubcategories) {
    const categories = await this.page.locator(this.computersCategory).allTextContents();
    expect(categories).toEqual(expectedSubcategories);
  }

  async addItemToWishlist() {
    await this.page.click(this.wishlistButton);
  }
}
