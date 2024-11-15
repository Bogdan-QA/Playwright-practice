// pages/EpamContactPage.js
import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class EpamContactPage {
  constructor(page) {
    this.page = page;
    this.contactUsButton = page.locator('a.cta-button-ui[href="https://www.epam.com/about/who-we-are/contact"]');
    this.reportDownloadButton = page.locator('a[href*="EPAM_Corporate_Overview_Q4_EOY.pdf"]');
    this.formSubmitButton = page.getByRole("button", { name: "Submit" });

    this.firstNameField = page.locator('label:has-text("First name")').locator('..');
    this.lastNameField = page.locator('label:has-text("Last name")').locator('..');
    this.emailField = page.locator('label:has-text("Email")').locator('..').first();
    this.phoneField = page.locator('label:has-text("Phone")').locator('..').first();
    this.heardAboutEpamField = page.locator('label:has-text("How did you hear about EPAM?")').locator('..');
    this.consentCheckbox = page.locator('[name="gdprConsent"]').locator('..').locator('..');
  }

  async open() {
    await this.page.goto('https://www.epam.com/about');
  }

  getAllFieldLocators() {
    return [
      this.firstNameField,
      this.lastNameField,
      this.emailField,
      this.phoneField,
      this.heardAboutEpamField
    ];
  }

  async downloadReportAndVerify(downloadsPath) {
    // Initiate download and wait for the download event
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.reportDownloadButton.click() // Initiates the download
    ]);

    // Define the full file path for where to save the download
    const filePath = path.join(downloadsPath, await download.suggestedFilename());

    // Save the downloaded file to the specified path
    await download.saveAs(filePath);

    // Verify the file exists
    expect(fs.existsSync(filePath)).toBe(true);

    // Verify that the file has the expected name and extension
    const expectedFileName = 'EPAM_Corporate_Overview_Q4_EOY.pdf';
    expect(path.basename(filePath)).toBe(expectedFileName);
    expect(path.extname(filePath)).toBe('.pdf');

    // Optional: Clean up by deleting the file after verification
    fs.unlinkSync(filePath);
  }
}
