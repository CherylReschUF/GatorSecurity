import React from 'react'
import GamePage from '../../src/components/questions/Game'

describe('<GamePage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<GamePage />)
  })
})