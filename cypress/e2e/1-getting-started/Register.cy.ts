describe("Registration Functionality", () => {
  it("Should successfully register a new user with valid information", () => {
    // Visit the registration page
    cy.visit(`${Cypress.env("BASE_URL")}/auth?register=true`);

    // Fill in the registration form
    cy.get("#name").type("newuser");
    cy.get("#email").type("newuser@example.com");
    cy.get("#password").type("Newpassword#1");
    cy.get("#confirmPassword").type("Newpassword#1");

    // Click the registration button
    cy.get(".flex.items-center > .inline-flex").click();
  });

  it("Should display appropriate error messages with invalid registration information", () => {
    cy.visit(`${Cypress.env("BASE_URL")}/auth?register=true`);

    cy.get("#name").type("d");

    cy.get(".bg-card > .flex.items-center > .inline-flex").click();

    cy.get(".pb-2").contains(/Email is a required field/);

    cy.get("#email").type("newuser@examplecom");

    cy.get(".bg-card > .flex.items-center > .inline-flex").click();

    cy.get(".pb-2").contains(/Password is a required field/);

    cy.get("#password").type("Newpassword");

    cy.get(".bg-card > .flex.items-center > .inline-flex").click();

    cy.get(".pb-2").contains(/Password must have atleast one Number/);

    cy.get("#password").clear();
  });
});
