import React from 'react'
import QuestionEdit from '../../src/components/questions/QuestionEdit'

describe('<QuestionEdit />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<QuestionEdit />)
  })
})