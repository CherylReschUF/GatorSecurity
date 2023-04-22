import React from 'react'
import ProfilePage from '../../src/components/users/Profile'

describe('<ProfilePage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ProfilePage />)
  })
})