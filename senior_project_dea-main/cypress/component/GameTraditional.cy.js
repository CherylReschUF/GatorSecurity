import React from 'react'
import GameTraditionalPage from '../../src/components/questions/GameTraditional'

describe('<GameTraditionalPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<GameTraditionalPage />)
  })
})