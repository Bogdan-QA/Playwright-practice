import { test, expect } from '@playwright/test';
import { DemoWebShopHomePage } from '../pages/DemoWebShopObjects/DemoWebShopHomePage';
import { RegistrationPage } from '../pages/DemoWebShopObjects/RegistrationPage';
import { ProductListPage } from '../pages/DemoWebShopObjects/ProductListPage';
import { CartPage } from '../pages/DemoWebShopObjects/CartPage';
import testData from '../data/testData.json';

test.describe('Demo Web Shop UI Tests', () => {
  let demoWebShopHomePage;
  let registrationPage;
  let productListPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    demoWebShopHomePage = new DemoWebShopHomePage(page);
    registrationPage = new RegistrationPage(page);
    productListPage = new ProductListPage(page);
    cartPage = new CartPage(page);
    await demoWebShopHomePage.open();
  });

  test('Verify that allows register a User', async () => {
    await demoWebShopHomePage.registerUser.click();
    await registrationPage.registerUser(testData.demoWebShopData.registrationData);
    await expect(registrationPage.registrationMessage).toBeVisible();
    const message = await registrationPage.getRegistrationMessage();
    expect(message).toContain(testData.demoWebShopData.successfulRegistrationMessage);
  });

  test('Verify that allows a user to login', async () => {
    await demoWebShopHomePage.loginUser.click();
    await registrationPage.loginUser(testData.demoWebShopData.loginData);
    const message = await demoWebShopHomePage.getAccountEmail();
    expect(message).toContain(testData.demoWebShopData.loginData.email);
  });

  test('Verify that the Computer groups has 3 sub groups with correct names', async () => {
    await demoWebShopHomePage.computersGroup.click();
    await productListPage.verifySubCategoryTitles(testData.demoWebShopData.subCategoryTitles);
  });

  test('Verify that the Customer can sort out products by price', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await productListPage.verifySortByPrice();
  });

  test('Verify that the customer can change number of items on page', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await productListPage.changeNumberOfItems();
  });

  test('Verify that the customer can add a product to the wishlist', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await expect(demoWebShopHomePage.wishlistButton).toBeVisible();
    const itemNumInWishlist = await demoWebShopHomePage.wishlistQuantity.textContent();
    const parsedItemNumWishlist = parseInt(itemNumInWishlist.replace(/\D/g, ''), 10);
    expect(parsedItemNumWishlist).toEqual(0);
    await productListPage.addProductToWishList();
    const itemNumInWishlistAfterAdd = await demoWebShopHomePage.wishlistQuantity.textContent();
    const parsedItemNumInWishlistAfterAdd = parseInt(itemNumInWishlistAfterAdd.replace(/\D/g, ''), 10);
    expect(parsedItemNumInWishlistAfterAdd).toEqual(1);
    await demoWebShopHomePage.wishlistButton.click();
    const expectedBookTitle = 'Fiction EX';
    await productListPage.validateBookInWishlist(expectedBookTitle);
  });

  test('Verify that the customer can add a product to the cart', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await expect(demoWebShopHomePage.cartButton).toBeVisible();
    const itemNumInCart = await demoWebShopHomePage.cartQuantity.textContent();
    const parsedItemNumInCart = parseInt(itemNumInCart.replace(/\D/g, ''), 10);
    expect(parsedItemNumInCart).toEqual(0);
    const addedProductInCart = await productListPage.addProductToCart();

    const itemNumInCartAfterAdd = await demoWebShopHomePage.cartQuantity.textContent();
    const parseditemNumInCartAfterAdd = parseInt(itemNumInCartAfterAdd.replace(/\D/g, ''), 10);
    expect(parseditemNumInCartAfterAdd).toEqual(1);
    await demoWebShopHomePage.cartButton.click();

    const productDetailsInCart = await cartPage.getProductDetails();
    // Compare the details
    expect(productDetailsInCart.productTitle).toBe(addedProductInCart.productTitle);
    expect(productDetailsInCart.productPrice).toBe(addedProductInCart.actualPrice);
    expect(productDetailsInCart.productQty).toBe(1);
  });

  test('Verify that the customer can remove a product to the cart', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await productListPage.addProductToCart();
    await demoWebShopHomePage.cartButton.click();
    await cartPage.removeProductFromCart();
    const itemNumInCart = await demoWebShopHomePage.cartQuantity.textContent();
    const parseditemNumInCart = parseInt(itemNumInCart.replace(/\D/g, ''), 10);
    expect(parseditemNumInCart).toEqual(0);
    const emptyCartMessage = (await cartPage.orderSummaryMessage.textContent()).trim();
    expect(emptyCartMessage).toEqual('Your Shopping Cart is empty!');
  });

  test.skip('Verify that the customer can checkout a product', async () => {
    await demoWebShopHomePage.booksGroup.click();
    await productListPage.addProductToCart();
    await demoWebShopHomePage.cartButton.click();

  });
});
