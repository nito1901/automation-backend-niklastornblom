// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const ENDPOINT_LOGIN = 'http://localhost:3000/api/login'
const ENDPOINT_LOGOUT = 'http://localhost:3000/api/logout'

Cypress.Commands.add('authenticateSession', () => {
    const userCredentials = {
        "username":"tester01",
        "password":"GteteqbQQgSr88SwNExUQv2ydb7xuf8c"
    }
    cy.request({
        method: "POST",
        url: ENDPOINT_LOGIN,
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCredentials)
    }).then((response => {
        expect(response.status).to.eq(200)
        Cypress.env({loginToken:response.body})
    }))
})

Cypress.Commands.add('endSession', () => {
    cy.request({
        method:"POST",
        url: ENDPOINT_LOGOUT,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)
    }))
}) 