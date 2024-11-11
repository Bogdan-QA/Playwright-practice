// pages/EpamContactPage.js
import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class EpamContactPage {
  constructor(page) {
    this.page = page;
    this.contactUsButton = page.locator('a.cta-button-ui[href="https://www.epam.com/about/who-we-are/contact"]');
    this.reportDownloadButton = page.locator('a[href*="EPAM_Corporate_Overview_Q4_EOY.pdf"]');
  }

  async open() {
    await this.page.goto('https://www.epam.com/about');
  }

  async validateRequiredFields() {

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
