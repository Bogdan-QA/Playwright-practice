// tests/epam.spec.js
import { test, expect } from '@playwright/test';
import { EpamHomePage } from '../pages/EpamPageObjects/EpamHomePage';
import { EpamContactPage } from '../pages/EpamPageObjects/EpamContactPage';

test.describe('EPAM.com UI Tests', () => {
  let epamHomePage;

  test.beforeEach(async ({ page }) => {
    epamHomePage = new EpamHomePage(page);
    await epamHomePage.open();
    await epamHomePage.acceptCookies.click();
  });

  test('Check the title is correct', async () => {
    await epamHomePage.checkTitle('EPAM | Software Engineering & Product Development Services');
  });

  test('Check the ability to switch Light / Dark mode', async () => {
    await expect(epamHomePage.themeToggle).toBeVisible();
    await expect(epamHomePage.lightMode).not.toBeVisible();
    await expect(epamHomePage.darkMode).toBeVisible();
    await epamHomePage.toggleTheme();
    await expect(epamHomePage.lightMode).toBeVisible();
    await expect(epamHomePage.darkMode).not.toBeVisible();

  });

  test('Check that allow to change language to UA', async () => {
    const initialUrl = epamHomePage.page.url();
    await epamHomePage.switchLanguageToUA();
    const newUrl = epamHomePage.page.url();
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toBe('https://careers.epam.ua/');
  });

  test('Check the policies list', async () => {
    const expectedPolicies = [
      'INVESTORS',
      'COOKIE POLICY',
      'OPEN SOURCE',
      'APPLICANT PRIVACY NOTICE',
      'PRIVACY POLICY',
      'WEB ACCESSIBILITY',
    ];
    await epamHomePage.verifyPoliciesList(expectedPolicies);
  });

  test('Check that allows to switch location list by region', async () => {
    await epamHomePage.verifyLocationTabs();
    await epamHomePage.switchRegionTab('EMEA');
  });

  test('Check the search function', async () => {
    await epamHomePage.search('AI');
    const newUrl = epamHomePage.page.url();
    expect(newUrl).toBe('https://www.epam.com/search?q=AI');
    await expect(epamHomePage.searchResultCounter).toBeVisible();
  });
});

test.describe('EPAM.com About section UI Tests', () => {
  let epamContactPage;
  let epamHomePage;

  test.beforeEach(async ({ page }) => {
    epamHomePage = new EpamHomePage(page);
    epamContactPage = new EpamContactPage(page);
    await epamContactPage.open();
    await epamHomePage.acceptCookies.click();
  });

  test.skip('Check contact form fields validation', async () => {
    await epamContactPage.contactUsButton.nth(1).click();

  });

  test('Check that the company logo leads to homepage', async () => {
    await epamHomePage.headerEpamLogo.click();
    const newUrl = epamHomePage.page.url();
    expect(newUrl).toBe('https://www.epam.com/');
  });

  test('Check that the report can be downloaded', async () => {
    const downloadsPath = './downloads'; // Ensure this directory exists
    await epamContactPage.downloadReportAndVerify(downloadsPath);
  });
});
