import React from 'react'
import LoginBanner from '../../src/components/users/LoginBanner'

describe('<LoginBanner />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LoginBanner />)
  })
})