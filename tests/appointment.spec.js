import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AppointmentPage } from './pages/AppointmentPage';

// Helper function to get all available slots and select one at random
async function selectRandomSlotOnAppointmentPage(appointmentPage) {
  const slots = await appointmentPage.getAvailableSlots();
  const count = await slots.count();
  if (count === 0) throw new Error('No available slots found');
  const randomIndex = Math.floor(Math.random() * count);
  await slots.nth(randomIndex).waitFor({ state: 'visible' });
  await slots.nth(randomIndex).click();
}

//This will schedule a new appointment with random slot selection
test('Schedule a new appointment with random slot selection', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const appointmentPage = new AppointmentPage(page);

  await loginPage.goto();
  await loginPage.login('amol.shete+TP@medarch.com', 'Test@123$');

  // All steps up to date selection are handled by scheduleAppointment
  // If you want to use the helper directly, you can do so after date selection:
  //scheduleAppointment method handles all the steps from scheduling tab to date selection
  await appointmentPage.schedulingTab.waitFor({ state: 'visible' });
  await appointmentPage.schedulingTab.click();
  await expect(appointmentPage.appointmentsText).toBeVisible({ timeout: 10000 });
  await appointmentPage.appointmentsText.click();
  await appointmentPage.scheduleAppointmentButton.waitFor({ state: 'visible' });
  await appointmentPage.scheduleAppointmentButton.click();
  await appointmentPage.newAppointmentMenuItem.waitFor({ state: 'visible' });
  await appointmentPage.newAppointmentMenuItem.click();
  await appointmentPage.patientNameCombo.waitFor({ state: 'visible' });
  await appointmentPage.patientNameCombo.click();
  await appointmentPage.patientNameCombo.fill('akshay');
  await page.getByRole('option', { name: 'Akshay Patil 20 Jan' }).click();
  await appointmentPage.appointmentTypeCombo.waitFor({ state: 'visible' });
  await appointmentPage.appointmentTypeCombo.click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await appointmentPage.reasonForVisitTextbox.waitFor({ state: 'visible' });
  await appointmentPage.reasonForVisitTextbox.click();
  await appointmentPage.reasonForVisitTextbox.fill('saddas');
  await appointmentPage.telehealthButton.waitFor({ state: 'visible' });
  await appointmentPage.telehealthButton.click();
  await appointmentPage.providerCombo.waitFor({ state: 'visible' });
  await appointmentPage.providerCombo.click();
  await appointmentPage.providerCombo.fill('bhus');
  await page.getByRole('option', { name: 'Bhushan Vanjari' }).click();
  await appointmentPage.disabledInput.waitFor({ state: 'visible' });
  await appointmentPage.disabledInput.click();
  await appointmentPage.viewAvailabilityButton.waitFor({ state: 'visible' });
  await appointmentPage.viewAvailabilityButton.click();
  await appointmentPage.ninthGridCell.waitFor({ state: 'visible' });
  await appointmentPage.ninthGridCell.click();

  // Use the helper function to select a random slot
  await selectRandomSlotOnAppointmentPage(appointmentPage);

  await appointmentPage.saveAndCloseButton.waitFor({ state: 'visible' });
  await appointmentPage.saveAndCloseButton.click();
}); 