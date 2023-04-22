import React from 'react'
import QuestionCRUD from '../../src/components/questions/QuestionCRUD'

describe('<QuestionCRUD />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<QuestionCRUD />)
  })
})