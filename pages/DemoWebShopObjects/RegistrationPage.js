import { expect } from '@playwright/test';

export class RegistraionPage {
  constructor(page) {
    this.page = page;

    this.genderMale = page.locator('#gender-male');
    this.genderFemale = page.locator('#gender-female');
    this.firstNameField = page.locator('#FirstName');
    this.lastNameField = page.locator('#LastName');
    this.emailField = page.locator('#Email');
    this.passwordField = page.locator('#Password');
    this.confirmPasswordField = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button')
  }

  async registerUser({ firstName, lastName, email, password, confirmPassword }) {
    
    // Fill in the required fields
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(confirmPassword);

    // Submit the form
    await this.registerButton.click();
    
  }
}