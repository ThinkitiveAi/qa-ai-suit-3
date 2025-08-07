import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { PatientPage } from './pages/PatientPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { faker } from '@faker-js/faker';

function formatDateToMMDDYYYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

test('Add new patient flow', async ({ page }) => {
  // Add New patient flow
  const loginPage = new LoginPage(page);
  const patientPage = new PatientPage(page);

  // Generate random patient data
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const dobDate = faker.date.birthdate({ min: 1950, max: 2005, mode: 'year' });
  const dob = formatDateToMMDDYYYY(dobDate);

  await loginPage.goto();
  await loginPage.login('amol.shete+TP@medarch.com', 'Test@123$');

  await patientPage.startAddPatient();
  await patientPage.fillPatientDetails({
    firstName,
    lastName,
    dob,
    gender: 'Male',
    maritalStatus: 'Single',
    language: 'English',
    mobile: '(854) 114-11111',
    email,
  });
  await patientPage.savePatient();

  // Go to patient list and check for the new patient
  console.log('Expecting patient name:', firstName);
  await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/app/provider/patients');
  await expect(page.getByText(firstName)).toBeVisible({ timeout: 10000 });
});

test('Schedule a new appointment', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const appointmentPage = new AppointmentPage(page);

  await loginPage.goto();
  await loginPage.login('amol.shete+TP@medarch.com', 'Test@123$');
  await appointmentPage.scheduleAppointment(
    'akshay',
    'New Patient Visit',
    'saddas',
    'bhus'
  );
}); 