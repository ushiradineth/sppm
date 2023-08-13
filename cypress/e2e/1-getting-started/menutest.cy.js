describe('Menu Functionality', () => {
    beforeEach(() => {
      // Visit the page with the menu
      cy.visit('/menu');
    });
  
    it('Should open the menu when clicked', () => {
      // Click the menu button
      cy.get('.menu-button').click();
  
      // Assert that the menu is open
      cy.get('.menu-options').should('be.visible');
    });
  
    it('Should close the menu when clicking outside', () => {
      // Click the menu button
      cy.get('.menu-button').click();
  
      // Click outside the menu
      cy.get('body').click('top');
  
      // Assert that the menu is closed
      cy.get('.menu-options').should('not.be.visible');
    });
  
    it('Should navigate to the selected option', () => {
      // Click the menu button
      cy.get('.menu-button').click();
  
      // Click a specific option
      cy.contains('.menu-options', 'Profile').click();
  
      // Assert that the user is navigated to the profile page or another expected page
      cy.url().should('include', '/profile');
    });
  });
  