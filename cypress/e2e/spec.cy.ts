describe('Initial test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Heavy music')
  })
})
