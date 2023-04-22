import React from 'react'
import MatchingCard from '../../src/components/questions/Matching/MatchingCard'

describe('<MatchingCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MatchingCard />)
  })
})