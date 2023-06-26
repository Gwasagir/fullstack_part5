const test_name = 'Niko Keurulainen'
const test_username = 'nikok'
const test_password = 'salainen'

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: test_name,
      username: test_username,
      password: test_password
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')  
  })

  it('Login form is shown by clicking "log in"-button', function() {
    cy.contains('log in').click()
    cy.get('form').contains('username')
    cy.get('form').contains('password')
    cy.get('form').contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type(test_username)
      cy.get('#password').type(test_password)
      cy.get('#login-button').click()

      cy.contains(`${test_name} logged in`)
      cy.get('form').contains('logout')
    })

    it('fails with wrong credentials', function() {
      // ...
    })
  })
  
  describe('When logged in', function(){
    beforeEach(function() {
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
        username: test_username, password: test_password
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('')
      })
    })

    it('A blog can be created', function() {
      cy.contains('show create').click()

    })
  })
})