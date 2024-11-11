// pages/EpamHomePage.js
import { expect } from '@playwright/test';

export class EpamHomePage {
  constructor(page) {
    this.page = page;
    this.headerEpamLogo = page.locator('.header__logo-link');
    this.acceptCookies = page.locator('#onetrust-accept-btn-handler');
    this.themeToggle = page.locator('.switch').nth(1);
    this.lightMode = page.locator('.light-mode');
    this.darkMode = page.locator('.dark-mode');
    this.languageDropdown = page.locator('.mobile-location-selector__button-section').nth(1);
    this.ukrainianLanguageDropdown = page.locator('.location-selector__panel a[href="https://careers.epam.ua"]');
    this.policiesList = page.locator('.policies');
    this.locationTabs = page.locator('[role="tablist"]');
    this.searchIcon = page.locator('.header-search__search-icon').nth(1);
    this.searchField = page.locator('input[placeholder="What are you looking for?"]')
    this.searchSubmit = page.locator('.bth-text-layer');
    this.searchResultCounter = page.locator('.search-results__counter');
  }

  async open() {
    await this.page.goto('https://www.epam.com/');
  }

  async checkTitle(expectedTitle) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async switchLanguageToUA() {
    await this.languageDropdown.click();
    await this.ukrainianLanguageDropdown.click();
  }

  async verifyPoliciesList(expectedPolicies) {
    const policiesText = await this.policiesList.locator('a').allTextContents();
    expect(policiesText).toEqual(expect.arrayContaining(expectedPolicies));
}

  async verifyLocationTabs() {
    const tabs = await this.locationTabs.locator('a[role="tab"]').allTextContents();
    expect(tabs).toEqual(['AMERICAS', 'EMEA', 'APAC']);
  }

  async switchRegionTab(region) {
    await this.locationTabs.scrollIntoViewIfNeeded();
    const regionTab = this.locationTabs.locator(`a[role="tab"]`, { hasText: region });
    await regionTab.click();

    // Verify the clicked region has the `active` class
    await expect(regionTab).toHaveClass(/active/);

    // Verify other tabs do not have the `active` class
    const otherTabs = this.locationTabs.locator(`a[role="tab"]:not(:has-text("${region}"))`);
    const otherTabsCount = await otherTabs.count();

    for (let i = 0; i < otherTabsCount; i++) {
        await expect(otherTabs.nth(i)).not.toHaveClass(/active/);
    }
  }

  async search(query) {
    await this.searchIcon.click();
    //const searchInput = this.page.locator('input[placeholder="What are you looking for?"]');
    await this.searchField.waitFor({ state: 'visible' });
    await this.searchField.fill(query);
    await this.searchSubmit.click();
  }
}
