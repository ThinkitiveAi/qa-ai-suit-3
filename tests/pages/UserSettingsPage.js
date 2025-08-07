import { expect } from '@playwright/test';

export class UserSettingsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.menuArrow = page.getByTestId('KeyboardArrowRightIcon').locator('path');
    this.userSettingsText = page.getByText('User Settings');
    this.providersTab = page.getByRole('tab', { name: 'Providers' });
    this.addProviderUserButton = page.getByRole('button', { name: 'Add Provider User' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.providerTypeCombo = page.getByRole('combobox', { name: 'Provider Type' });
    this.providerTypeOptionLCSW = page.getByRole('option', { name: 'LCSW' });
    this.roleCombo = page.getByRole('combobox', { name: 'Role *' });
    this.roleOptionProvider = page.getByRole('option', { name: 'Provider' });
    this.genderCombo = page.getByRole('combobox', { name: 'Gender *' });
    this.genderOptionMale = page.getByRole('option', { name: 'Male', exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
  }

  async openUserSettings() {
    await this.page.getByRole('banner').waitFor();
    await this.menuArrow.click();
    await this.userSettingsText.click();
  }

  async goToProvidersTab() {
    await this.providersTab.click();
  }

  async addProviderUser({ firstName, lastName, providerType, role, gender, email }) {
    await this.addProviderUserButton.click();
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
    await this.providerTypeCombo.click();
    await this.page.getByRole('option', { name: providerType }).click();
    await this.roleCombo.click();
    await this.page.getByRole('option', { name: role }).click();
    await this.genderCombo.click();
    await this.page.getByRole('option', { name: gender, exact: true }).click();
    await this.saveButton.click();
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.saveButton.click();
  }
} 