import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the login page", () => {
  // Intercept login API call BEFORE visit
  cy.intercept("POST", "**/login").as("loginRequest");

  cy.visit("/");
});

When('I enter {string} into the username field', (username) => {
  cy.get('input[placeholder="Username"]').clear().type(username);
});

When('I enter {string} into the password field', (password) => {
  cy.get('input[placeholder="Password"]').clear().type(password);
});

When("I click the login button", () => {
  cy.get('button[type="submit"]').click();
});

Then("I should be logged in successfully", () => {
  // Wait for the actual API call to complete
  cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

  // Validate localStorage + redirection
  cy.window().then((win) => {
    expect(win.localStorage.getItem("isLoggedIn")).to.eq("true");
  });

  // Optional: Check if user was redirected to Employee page
  cy.contains("Employee List").should("be.visible");
});

Then('I should see an error message {string}', (errorMessage) => {
  cy.wait("@loginRequest"); // optional but safe
  cy.contains(".text-danger", errorMessage).should("be.visible");
});
