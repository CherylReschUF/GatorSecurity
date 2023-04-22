import React from 'react'
import MyNavbar from '../../src/components/Navbar'

describe('<MyNavbar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MyNavbar />)
  })
})