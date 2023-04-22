import React from 'react'
import QuestionCard from '../../src/components/questions/QuestionCard'

describe('<QuestionCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<QuestionCard />)
  })
})