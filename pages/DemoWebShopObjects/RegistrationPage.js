export class RegistrationPage {
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
    this.registrationMessage = page.locator('.result');
    this.loginButton = page.locator('.login-button');
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

  async loginUser({email, password }) {
    
    // Fill in the required fields
    await this.emailField.fill(email);
    await this.passwordField.fill(password);

    // Submit the form
    await this.loginButton.click();
  }

  async getRegistrationMessage() {
    return await this.registrationMessage.textContent();
  }
}