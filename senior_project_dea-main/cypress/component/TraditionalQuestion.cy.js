import React from 'react'
import TradQuestion from '../../src/components/questions/TraditionalQuestion'

describe('<TradQuestion />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TradQuestion />)
  })
})