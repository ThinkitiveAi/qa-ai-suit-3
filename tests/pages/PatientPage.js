import { expect } from '@playwright/test';

export class PatientPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.addPatientButton = page.getByTestId('AddCircleOutlineOutlinedIcon');
    this.newPatientMenuItem = page.getByRole('menuitem', { name: 'New Patient' }).locator('div');
    this.enterPatientDetailsIcon = page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.dobInput = page.getByRole('textbox', { name: 'Date Of Birth *' });
    this.genderDropdown = page.locator('div').filter({ hasText: /^Gender \*$/ }).nth(1);
    this.genderMaleOption = page.getByRole('option', { name: 'Male', exact: true });
    this.maritalStatusDropdown = page.getByRole('combobox', { name: 'Marital Status' });
    this.maritalStatusSingleOption = page.getByRole('option', { name: 'Single' });
    this.languagesDropdown = page.getByRole('combobox', { name: 'Languages' });
    this.languageEnglishOption = page.getByRole('option', { name: 'English', exact: true });
    this.mobileInput = page.getByRole('textbox', { name: 'Mobile Number *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async startAddPatient() {
    await this.addPatientButton.click();
    await this.newPatientMenuItem.click();
    await this.enterPatientDetailsIcon.click();
    await this.nextButton.click();
  }

  async fillPatientDetails({ firstName, lastName, dob, gender, maritalStatus, language, mobile, email }) {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
    await this.dobInput.click();
    await this.dobInput.fill(dob);
    await this.genderDropdown.click();
    await this.genderMaleOption.click();
    await this.maritalStatusDropdown.click();
    await this.maritalStatusSingleOption.click();
    await this.languagesDropdown.click();
    await this.languageEnglishOption.click();
    await this.mobileInput.click();
    await this.mobileInput.fill(mobile);
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async savePatient() {
    await this.saveButton.click();
  }
} 