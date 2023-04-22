import React from 'react'
import Matching from '../../src/components/questions/Matching/Matching'

describe('<Matching />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Matching />)
  })
})