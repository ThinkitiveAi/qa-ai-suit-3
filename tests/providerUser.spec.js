import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { UserSettingsPage } from './pages/UserSettingsPage';
const {
  randomFirstName,
  randomLastName,
  randomEmail,
  randomProviderType,
  randomRole,
  randomGender,
} = require('./utils');

// @regression

test.describe('Provider User Management', () => {
  test('should login and add a new provider user', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const userSettingsPage = new UserSettingsPage(page);
    const baseUrl = 'https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login';
    const credentials = {
      email: 'rose.gomez@jourrapide.com',
      password: 'Pass@123',
    };
    const providerUser = {
      firstName: randomFirstName(),
      lastName: randomLastName(),
      providerType: randomProviderType(),
      role: randomRole(),
      gender: randomGender(),
      email: randomEmail(),
    };

    // Act
    await page.goto(baseUrl);
    await loginPage.login(credentials.email, credentials.password);
    await userSettingsPage.openUserSettings();
    await userSettingsPage.goToProvidersTab();
    await userSettingsPage.addProviderUser(providerUser);

    // Assert
    // Add assertions as needed, e.g., check for success toast, new user in list, etc.
    // Example (pseudo):
    // await expect(page.getByText('Provider user added successfully')).toBeVisible();
  });
}); 