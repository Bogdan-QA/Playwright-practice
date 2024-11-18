export class CheckoutPage {

    constructor(page) {
        this.page = page;
        this.countryDropdown = page.locator('#BillingNewAddress_CountryId');
        this.cityField = page.locator('#BillingNewAddress_City');
        this.address1Field = page.locator('#BillingNewAddress_Address1');
        this.zipcodeField = page.locator('#BillingNewAddress_ZipPostalCode');
        this.phoneField = page.locator('#BillingNewAddress_PhoneNumber');
        this.checkoutContinueButton = page.getByRole("button", { name: "Continue" });
        this.shippingMethodContinueButton = page.locator('#shipping-method-buttons-container [value="Continue"]');
        this.paymentMethodContinueButton = page.locator('#checkout-step-payment-method [value="Continue"]');
        this.paymentInformationContinueButton = page.locator('#checkout-step-payment-info [value="Continue"]');
        this.orderConfirmationContinueButton = page.locator('#confirm-order-buttons-container [value="Confirm"]');
        this.orderSuccessfullyProcessedMessage = page.getByText('Your order has been');
    }

    async fillBillingAddressMandatoryFields(country, city, address1, zipcode, phone) {
        await this.countryDropdown.selectOption({ label: country });
        await this.cityField.fill(city);
        await this.address1Field.fill(address1);
        await this.zipcodeField.fill(zipcode);
        await this.phoneField.fill(phone);
    }

    async confirmBillingAddress() {
        await this.checkoutContinueButton.waitFor({ state: 'visible' });
        await this.checkoutContinueButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    async confirmShippingAddress() {
        await this.checkoutContinueButton.waitFor({ state: 'visible' });
        await this.checkoutContinueButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    async confirmShippingMethod() {
        await this.checkoutContinueButton.waitFor({ state: "visible" });
        await this.shippingMethodContinueButton.click();
    }

    async confirmPaymentMethod() {
        await this.paymentMethodContinueButton.waitFor({ state: "visible" });
        await this.paymentMethodContinueButton.click();
    }

    async confirmPaymentInformation() {
        await this.paymentInformationContinueButton.waitFor({ state: "visible" });
        await this.paymentInformationContinueButton.click();
    }

    async confirmOrder() {
        await this.orderConfirmationContinueButton.waitFor({ state: "visible" });
        await this.orderConfirmationContinueButton.click();
    }

    async getOrderConfirmationMessage() {
        return await this.orderSuccessfullyProcessedMessage.innerText();
    }
}