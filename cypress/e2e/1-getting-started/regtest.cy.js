describe('Registration Functionality', () => {
    it('Should successfully register a new user with valid information', () => {
      // Visit the registration page
      cy.visit(`${Cypress.env("BASE_URL")}/auth?register=true`);
  
      // Fill in the registration form
      cy.get('#name').type('newuser');
      cy.get('#email').type('newuser@example.com');
      cy.get('#password').type('Newpassword#1');
      cy.get('#confirmPassword').type('Newpassword#1');
  
      // Click the registration button
      cy.get('.flex.items-center > .inline-flex').click();
  
      // Assert that the user is redirected to the dashboard or another expected page
      //cy.url().should('include', '/dashboard');
  
      // Assert that the user is logged in
     // cy.get('.user-avatar').should('be.visible');
    });
  
     it('Should display appropriate error messages with invalid registration information', () => {
    //   // Visit the registration page
    //   cy.visit('/register');
    cy.visit(`${Cypress.env("BASE_URL")}/auth?register=true`);
  
    
    cy.get('#name').type('d');// Invalid: Empty username
      cy.get('#email').type('newuser@examplecom');// Invalid: Invalid email format
      cy.get('#password').type('Newpassword');// Invalid: Short password
      cy.get('#confirmPassword').type('Newpassword');
  
       // Click the registration button
       cy.get('.flex.items-center > .inline-flex').click();
  
      // Assert that error messages are displayed for each field
       cy.get('.:nth-child(1) > .pb-2').should('have.length', 1);
      cy.contains('.:nth-child(1) > .pb-2', 'Name must be at least 1 characters').should('be.visible');
      cy.contains('.:nth-child(2) > .pb-2', 'Email must be a valid email').should('be.visible');
      cy.contains('.:nth-child(3) > .pb-2', 'Password must have atleast one Number').should('be.visible');

      
     });
  });
  