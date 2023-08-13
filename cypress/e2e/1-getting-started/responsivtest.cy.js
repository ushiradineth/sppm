describe('Responsive Design', () => {
    context('Desktop View', () => {
      beforeEach(() => {
        // Set the viewport size to desktop width
        cy.viewport(1280, 800)
        // Visit the page you want to test
        cy.visit('http://localhost:3000')
      })
  
      it('should display the navigation menu properly', () => {
        // Assuming the navigation menu is displayed horizontally
        cy.get('.nav-menu').should('be.visible')
      })
  
      it('should display a two-column layout', () => {
        // Assuming the content is displayed in a two-column layout
        cy.get('.content-column').should('have.length', 2)
      })
    })
  
    context('Mobile View', () => {
      beforeEach(() => {
        // Set the viewport size to mobile width
        cy.viewport('iphone-6')
        // Visit the page you want to test
        cy.visit('http://localhost:3000')
      })
  
      it('should display a collapsed navigation menu', () => {
        // Assuming the navigation menu collapses into a hamburger icon
        cy.get('.nav-menu').should('not.be.visible')
        cy.get('.menu-icon').should('be.visible').click()
        cy.get('.nav-menu').should('be.visible')
      })
  
      it('should display a single-column layout', () => {
        // Assuming the content is displayed in a single column
        cy.get('.content-column').should('have.length', 1)
      })
    })
  })
  