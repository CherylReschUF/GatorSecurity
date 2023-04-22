import React from 'react'
import GameAdventurePage from '../../src/components/questions/GameAdventure'

describe('<GameAdventurePage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<GameAdventurePage />)
  })
})