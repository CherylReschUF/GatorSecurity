import React from 'react'
import SignUp from '../../src/components/users/SignUp'

describe('<SignUp/> Page Component', () => {
  it('renders', () => {
    cy.mount(<SignUp />)

  })

  it('Responds Correctly to Valid SignUp Credentials', () => {
    cy.mount(<SignUp />)

  })

  it('Responds Correctly to Valid SignUp Credentials that have already been entered', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SignUp />)
    
  })

})