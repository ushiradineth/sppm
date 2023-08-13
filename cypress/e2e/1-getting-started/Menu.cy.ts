describe("Menu Functionality", () => {
  beforeEach(() => {
    // Visit the page with the menu
    cy.visit(`${Cypress.env("BASE_URL")}`);
  });

  it("Should open the menu when clicked", () => {
    // Click the menu button
    cy.get('[href="/menu"]').click();

    // Assert that the menu is open
    cy.get(".text-h1").contains(/Our Menu/);

    cy.get(".absolute > .text-h5").contains(
      /Expertly crafted, high-quality coffees roasted fresh to order on energy-efficient Loring Smart Roasters/,
    );
  });
});
