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

      cy.get('html').should('contain',`${test_name} logged in`)
      cy.get('form').contains('logout')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type(test_username)
      cy.get('#password').type('totallywrongpassword')
      cy.get('#login-button').click()

      cy.get('.error').should('contain','Wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain',`${test_name} logged in`)
      cy.get('form').contains('login')
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
      cy.get('input[placeholder="write blog title here"]').type('Book of Cypress')
      cy.get('input[placeholder="write author here"]').type('J. K. Rower')
      cy.get('input[placeholder="write url here"]').type('http://testspace.fi')
      cy.get('#create-button').click()

      cy.contains('Book of Cypress')
    })

    // describe('Modifying and viewing created post', function() {
    //   beforeEach(function() {
    //     cy.request({
    //       method: 'POST',
    //       url: `${Cypress.env('BACKEND')}/blogs`,
    //       form: true,
    //       body: {
    //         title: 'Book of Cypress',
    //         author: 'J. K. Rower',
    //         url:'http://testspace.fi'
    //       },
    //     })
    //     cy.visit('')
    //   })
    // })

    it('A blog can be liked', function() {
      cy.contains('show create').click()
      cy.get('input[placeholder="write blog title here"]').type('Book of Cypress')
      cy.get('input[placeholder="write author here"]').type('J. K. Rower')
      cy.get('input[placeholder="write url here"]').type('http://testspace.fi')
      cy.get('#create-button').click()

      cy.contains('view').click()
      cy.get('html').should('contain', 'likes 0')
      cy.contains('like').click()
      cy.get('html').should('contain', 'likes 1')
    })

    it('A blog can be deleted by the owner', function() {
      cy.contains('show create').click()
      cy.get('input[placeholder="write blog title here"]').type('Book of Cypress')
      cy.get('input[placeholder="write author here"]').type('J. K. Rower')
      cy.get('input[placeholder="write url here"]').type('http://testspace.fi')
      cy.get('#create-button').click()
      cy.contains('view').click()
      cy.contains('delete').click()

      cy.get('html').should('not.contain', 'Book of Cypress')
      cy.get('.error').should('contain','Post deleted')
    })

    it.only('A blog delete button is only visible to the owner', function() {
      const user = {
        name: 'Jaana Testaaja',
        username: 'jaana',
        password: 'salainen'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

      cy.contains('show create').click()
      cy.get('input[placeholder="write blog title here"]').type('Book of Cypress')
      cy.get('input[placeholder="write author here"]').type('J. K. Rower')
      cy.get('input[placeholder="write url here"]').type('http://testspace.fi')
      cy.get('#create-button').click()
      cy.get('#logout-button').click()

      cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
        username: 'jaana', password: 'salainen'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
      })
      cy.visit('')

      cy.contains('view').click()
      cy.get('#like-button').should('exist')
      cy.get('#delete-button').should('not.exist')
    })
  })
})