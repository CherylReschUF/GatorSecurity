import React from 'react'
import LearnPage from '../../src/components/questions/Learn'

describe('<LearnPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LearnPage />)
  })
})