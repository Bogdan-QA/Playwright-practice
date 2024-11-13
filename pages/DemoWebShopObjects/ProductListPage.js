import { expect } from '@playwright/test';

export class ProductListPage {
  constructor(page) {
    this.page = page;
    this.subCategoryGrid = page.locator('.sub-category-grid');
    this.subCategoryItems = this.subCategoryGrid.locator('.sub-category-item');
    this.sortByDropDown = page.locator('#products-orderby');
    this.productGrid = page.locator('.product-grid');
    this.productItems = this.productGrid.locator('.item-box');
    this.productListNumber = page.locator('#products-pagesize');
    this.productItem = page.locator('.product-item');
    this.productTitle = page.locator('.product-title a');
    this.productActualPrice = page.locator('.actual-price');
    this.addToCart = page.locator('.button-2.product-box-add-to-cart-button');
    this.addToWishlistBtn = page.locator('.add-to-wishlist-button');
    this.fictionExBook = page.locator('a[href="/fiction-ex"]').nth(1);

  }

  async verifySubCategoryTitles(expectedTitles) {
    // Verify there are exactly 3 items
    const itemCount = await this.subCategoryItems.count();
    expect(itemCount).toBe(3);

    // Collect titles and verify they match the expected titles
    const actualTitles = [];
    for (let i = 0; i < itemCount; i++) {
      const title = await this.subCategoryItems.nth(i).locator('.title a').textContent();
      actualTitles.push(title.trim());
    }

    // Check if the titles match the expected order
    expect(actualTitles).toEqual(expectedTitles);
  }

  async verifySortByPrice() {
    await this.sortByDropDown.click();
    await this.sortByDropDown.selectOption({ label: 'Price: Low to High' });

    // Wait for the sorting to complete and for the product list to be updated
    await this.page.waitForLoadState('networkidle');

    // Collect all the actual prices
    const prices = [];
    const itemCount = await this.productItems.count();
    for (let i = 0; i < itemCount; i++) {
      const priceText = await this.productItems
        .nth(i)
        .locator('.actual-price')
        .textContent();
      const priceValue = parseFloat(priceText.replace('$', '').trim());
      prices.push(priceValue);
    }

    // Verify that prices are sorted in ascending order
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  }

  async changeNumberOfItems() {
    const initialItemCount = await this.productItems.count();
    await this.productListNumber.click();
    await this.productListNumber.selectOption({ label: '4' });
    await this.page.waitForTimeout(500);
    const currentItemCount = await this.productItems.count();
    expect(initialItemCount).not.toEqual(currentItemCount);
    expect(currentItemCount).toEqual(4);
  }

  async addProductToCart() {
    const firstProduct = this.productItems.first();

    // Extract the data-productId attribute
    const productId = await firstProduct.locator(this.productItem).getAttribute('data-productid');

    // Extract the title
    const productTitle = await firstProduct.locator(this.productTitle).textContent();

    // Extract the actual price
    const actualPrice = await firstProduct.locator(this.productActualPrice).textContent();

    // Click "Add to cart" button for the first item
    await firstProduct.locator(this.addToCart).click();
    await this.page.waitForTimeout(500);

    // Store or return the values as an object
    return {
      productId,
      productTitle: productTitle.trim(),
      actualPrice: actualPrice.trim()
    };
  }

  async addProductToWishList() {

    // Locate the product box containing the fiction-ex book
    const fictionExProduct = this.productItems.filter({
      has: this.fictionExBook,
    }).first();

    // Extract the data-productId attribute
    const productId = await fictionExProduct.locator(this.productItem).getAttribute('data-productid');

    // Extract the title
    const productTitle = await fictionExProduct.locator(this.productTitle).textContent();

    // Extract the actual price
    const actualPrice = await fictionExProduct.locator(this.productActualPrice).textContent();

    await this.fictionExBook.click();
    await this.addToWishlistBtn.click();
    await this.page.waitForTimeout(500);

    // Return the product details
    return {
      productId,
      productTitle: productTitle.trim(),
      actualPrice: actualPrice.trim(),
    };
  }

  async validateBookInWishlist(expectedBookTitle) {
    // Locate the book title in the wishlist
    const bookTitleLocator = this.page.locator('td.product a'); // Adjusted for your DOM
    const actualBookTitle = await bookTitleLocator.textContent();

    // Assert the title matches the expected book title
    expect(actualBookTitle.trim()).toBe(expectedBookTitle);
  }
}