describe('Shopping Cart', () => {
    beforeEach(() => {
      // Assuming your app is hosted at 'http://localhost:3000'
      cy.visit('http://localhost:3000/shopping-cart')
    })
  
    it('should add items to the cart and update total', () => {
      // Assuming your product list has items with 'Add to Cart' buttons
      cy.get('.product-item').first().find('.add-to-cart-btn').click()
  
      // Assuming the cart total is displayed with the class 'cart-total'
      cy.get('.cart-total').should('contain', 'Total: $19.99')
  
      // Assuming the cart icon shows the number of items in the cart
      cy.get('.cart-icon').should('contain', '1')
  
      // Add another item
      cy.get('.product-item').eq(2).find('.add-to-cart-btn').click()
  
      // Verify cart total and item count
      cy.get('.cart-total').should('contain', 'Total: $34.98')
      cy.get('.cart-icon').should('contain', '2')
    })
  
    it('should remove items from the cart', () => {
      // Add an item to the cart
      cy.get('.product-item').eq(1).find('.add-to-cart-btn').click()
  
      // Click on the cart icon to go to the cart page
      cy.get('.cart-icon').click()
  
      // Assuming the cart page displays added items with 'Remove' buttons
      cy.get('.cart-item').should('have.length', 1)
  
      // Remove the item from the cart
      cy.get('.remove-btn').click()
  
      // Verify that the cart is empty
      cy.get('.cart-empty-message').should('be.visible')
    })
  })
  