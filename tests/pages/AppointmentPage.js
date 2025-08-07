import { expect } from '@playwright/test';

export class AppointmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.schedulingTab = page.getByRole('tab', { name: 'Scheduling' });
    this.appointmentsText = page.getByText('Appointments');
    this.scheduleAppointmentButton = page.getByRole('button', { name: 'Schedule Appointment' });
    this.newAppointmentMenuItem = page.getByRole('menuitem', { name: 'New Appointment' });
    this.patientNameCombo = page.getByRole('combobox', { name: 'Patient Name *' });
    this.appointmentTypeCombo = page.getByRole('combobox', { name: 'Appointment Type *' });
    this.reasonForVisitTextbox = page.getByRole('textbox', { name: 'Reason For Visit *' });
    this.telehealthButton = page.getByRole('button', { name: 'Telehealth' });
    this.providerCombo = page.getByRole('combobox', { name: 'Provider *' });
    this.disabledInput = page.locator('.MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.Mui-disabled').first();
    this.viewAvailabilityButton = page.getByRole('button', { name: 'View availability' });
    this.ninthGridCell = page.getByRole('gridcell', { name: '9', exact: true });
    this.timeSlotButton = page.getByRole('button', { name: ':30 AM - 04:00 AM' });
    this.saveAndCloseButton = page.getByRole('button', { name: 'Save And Close' });
  }

  async scheduleAppointment(patientName, appointmentType, reason, provider) {
    await this.schedulingTab.waitFor({ state: 'visible' });
    await this.schedulingTab.click();

    await expect(this.appointmentsText).toBeVisible({ timeout: 10000 });
    await this.appointmentsText.click();

    await this.scheduleAppointmentButton.waitFor({ state: 'visible' });
    await this.scheduleAppointmentButton.click();

    await this.newAppointmentMenuItem.waitFor({ state: 'visible' });
    await this.newAppointmentMenuItem.click();

    await this.patientNameCombo.waitFor({ state: 'visible' });
    await this.patientNameCombo.click();
    await this.patientNameCombo.fill(patientName);
    await this.page.getByRole('option', { name: 'Akshay Patil 20 Jan' }).click();

    await this.appointmentTypeCombo.waitFor({ state: 'visible' });
    await this.appointmentTypeCombo.click();
    await this.page.getByRole('option', { name: appointmentType }).click();

    await this.reasonForVisitTextbox.waitFor({ state: 'visible' });
    await this.reasonForVisitTextbox.click();
    await this.reasonForVisitTextbox.fill(reason);

    await this.telehealthButton.waitFor({ state: 'visible' });
    await this.telehealthButton.click();

    await this.providerCombo.waitFor({ state: 'visible' });
    await this.providerCombo.click();
    await this.providerCombo.fill(provider);
    await this.page.getByRole('option', { name: 'Bhushan Vanjari' }).click();

    await this.disabledInput.waitFor({ state: 'visible' });
    await this.disabledInput.click();

    await this.viewAvailabilityButton.waitFor({ state: 'visible' });
    await this.viewAvailabilityButton.click();

    await this.ninthGridCell.waitFor({ state: 'visible' });
    await this.ninthGridCell.click();

    await this.selectRandomSlot();

    await this.saveAndCloseButton.waitFor({ state: 'visible' });
    await this.saveAndCloseButton.click();
  }

  /**
   * Returns all available slot buttons after a date is selected.
   */
  async getAvailableSlots() {
    // Use getByRole for broader coverage (not just <button>)
    const allButtons = this.page.getByRole('button');
    const count = await allButtons.count();
    const slotButtons = [];
    for (let i = 0; i < count; i++) {
      const button = allButtons.nth(i);
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      if (isVisible && isEnabled && text && text.includes(':')) {
        slotButtons.push(button);
      }
    }
    if (slotButtons.length === 0) {
      // Debug: print all button texts
      for (let i = 0; i < count; i++) {
        const button = allButtons.nth(i);
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        console.log(`Button[${i}]: text='${text}', visible=${isVisible}, enabled=${isEnabled}`);
      }
    }
    return {
      count: slotButtons.length,
      get: (idx) => slotButtons[idx],
    };
  }

  /**
   * Selects a random available slot after a date is selected.
   */
  async selectRandomSlot() {
    // Wait for at least one slot-like button to appear after date selection
    await this.page.waitForSelector('button:visible, [role="button"]:visible', { timeout: 10000 });
    const slots = await this.getAvailableSlots();
    if (slots.count === 0) throw new Error('No available slots found');
    const randomIndex = Math.floor(Math.random() * slots.count);
    const slot = slots.get(randomIndex);
    await slot.waitFor({ state: 'visible' });
    await slot.click();
  }
} 