const { faker } = require('@faker-js/faker');

function randomFirstName() {
  return faker.name.firstName();
}

function randomLastName() {
  return faker.name.lastName();
}

function randomEmail(domain = 'mailinator.com') {
  const user = faker.internet.userName().toLowerCase() + Date.now();
  return `${user}@${domain}`;
}

function randomProviderType() {
  // Extend as needed
  return 'LCSW';
}

function randomRole() {
  return 'Provider';
}

function randomGender() {
  return faker.helpers.arrayElement(['Male', 'Female']);
}

module.exports = {
  randomFirstName,
  randomLastName,
  randomEmail,
  randomProviderType,
  randomRole,
  randomGender,
}; 