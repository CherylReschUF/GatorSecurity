import React from 'react'
import DragNDrop from '../../src/components/questions/dragDrop/DragNDrop'

describe('<DragNDrop />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DragNDrop />)
  })
})