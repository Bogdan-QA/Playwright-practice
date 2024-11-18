export class CartPage {
    constructor(page) {
        this.page = page;

        this.productName = page.locator('.product-name');
        this.productPrice = page.locator('.product-unit-price');
        this.productQty = page.locator('.qty-input');
        this.removeFromCartCheckbox = page.locator('input[name="removefromcart"]');
        this.updateCartBtn = page.locator('input[name="updatecart"]');
        this.orderSummaryMessage = page.locator('.order-summary-content');
        this.termscheckbox = page.locator('#termsofservice[type="checkbox"]');
        this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    }

    // Method to retrieve product details from the cart
    async getProductDetails() {
        const productTitle = await this.productName.textContent();
        const productPrice = await this.productPrice.textContent();
        const productQty = await this.productQty.inputValue();

        // Return the details as an object
        return {
            productTitle: productTitle.trim(),
            productPrice: productPrice.trim(),
            productQty: parseInt(productQty, 10)
        };
    }

    async removeProductFromCart() {
        await this.removeFromCartCheckbox.waitFor({ state: 'visible' });
        await this.removeFromCartCheckbox.setChecked(true);
        await this.updateCartBtn.click();
    }

    async navigateToCheckout() {
        await this.termscheckbox.setChecked(true);
        await this.checkoutButton.click();
    }
}