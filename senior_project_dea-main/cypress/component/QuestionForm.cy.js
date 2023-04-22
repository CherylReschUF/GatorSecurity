import React from 'react'
import QuestionForm from '../../src/components/questions/QuestionForm'

describe('<QuestionForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<QuestionForm />)
  })
})