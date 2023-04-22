import React from 'react'
import Logout from '../../src/components/users/Logout'

describe('<Logout />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Logout />)
  })
})