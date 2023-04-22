import React from 'react'
import UserInfo from '../../src/components/users/UserInfo'

describe('<UserInfo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserInfo />)
  })
})