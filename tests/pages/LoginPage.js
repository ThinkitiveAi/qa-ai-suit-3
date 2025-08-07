import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: '*********' });
    this.loginButton = page.getByRole('button', { name: "Let's get Started" });
  }

  async goto() {
    await this.page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/auth/login');
  }

  async login(email, password) {
    await this.emailInput.click({ modifiers: ['ControlOrMeta'] });
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
} 