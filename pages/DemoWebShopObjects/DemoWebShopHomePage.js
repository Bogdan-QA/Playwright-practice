import { expect } from '@playwright/test';

export class DemoWebShopHomePage {
  constructor(page) {
    this.page = page;
    this.registerUser = page.locator('.ico-register');
    this.loginUser = page.locator('.ico-login');
    this.loggedInAccount = page.locator('.account').first();
    this.topNavigation = page.locator('.top-menu');
    this.computersGroup = this.topNavigation.locator('a[href="/computers"]');
    this.booksGroup = this.topNavigation.locator('a[href="/books"]');
    this.cartButton = page.locator('.ico-cart').first();
    this.cartQuantity = this.cartButton.locator('.cart-qty');
    this.wishlistButton = page.locator('.ico-wishlist').first();
    this.wishlistQuantity = this.wishlistButton.locator('.wishlist-qty');
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
