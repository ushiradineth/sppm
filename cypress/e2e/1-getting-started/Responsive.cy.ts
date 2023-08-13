describe("Responsive Design", () => {
  context("Desktop View", () => {
    beforeEach(() => {
      // Set the viewport size to desktop width
      cy.viewport(1280, 800);
      // Visit the page you want to test
      cy.visit(`${Cypress.env("BASE_URL")}`);
    });

    it("should display the navigation menu properly", () => {
      // Assuming the navigation menu is displayed horizontally
      cy.get('[href="/menu"]').should("be.visible");
    });
  });

  context("Mobile View", () => {
    beforeEach(() => {
      // Set the viewport size to mobile width
      cy.viewport("iphone-6");
      // Visit the page you want to test
      cy.visit(`${Cypress.env("BASE_URL")}`);
    });

    it("should display a collapsed navigation menu", () => {
      cy.get('[name*="Hamburger menu icon"]').click();
      cy.get('[href="/menu"]').should("be.visible");
    });
  });
});
