import { expect } from '@playwright/test';

export class DemoWebShopHomePage {
  constructor(page) {
    this.page = page;
    this.registerUser = page.locator('.ico-register');
    this.firstName = page.locator('#FirstName');
    
  }

  async open() {
    await this.page.goto('https://demowebshop.tricentis.com/');
  }

  async verifyComputersSubcategories(expectedSubcategories) {
    const categories = await this.page.locator(this.computersCategory).allTextContents();
    expect(categories).toEqual(expectedSubcategories);
  }

  async addItemToWishlist() {
    await this.page.click(this.wishlistButton);
  }
}
