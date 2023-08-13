describe('Login Functionality', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit(`${Cypress.env("BASE_URL")}/auth?register=true`);
    })
    it('Should successfully log in with valid credentials', () => {
        // Visit the login page
        cy.visit(`${Cypress.env("BASE_URL")}/auth`);
    
        // Fill in the login form
        
      cy.get('#email').type('newuser@example.com');
      cy.get('#password').type('Newpassword#1');
    
        // Click the login button
        cy.get('.flex.items-center > .inline-flex').click();
    
        // Assert that the user is redirected to the dashboard or another expected page
       // cy.url().should('include', '/dashboard');

         // Assert that the user is logged in

        //cy.get('.user-avatar').should('be.visible');
    });

        
  /*it('Should display an error message with invalid credentials', () => {
    // Visit the login page
    cy.visit('http://localhost:3000/auth');

    // Fill in the login form with invalid credentials
    cy.get('input[name="email"]').type('invalid@email.com');
    cy.get('input[name="password"]').type('invalidpassword');

    // Click the login button
    cy.get('button[type="submit"]').click();

    // Assert that an error message is displayed
    cy.get('.error-message').should('be.visible');
  });*/
    
  })