const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

function createRandomClientPayload(){
    const fakeName = faker.name.firstName() + " " + faker.name.lastName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name":fakeName,
        "email":fakeEmail,
        "telephone":fakePhone
    }

    return payload
}

function getRequestAllClientsAssertion(cy, name, email, telephone){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        expect(JSON.stringify(response.body[response.body.length -1].name)).to.have.string(name)
        expect(JSON.stringify(response.body[response.body.length -1].email)).to.have.string(email)
        expect(JSON.stringify(response.body[response.body.length -1].telephone)).to.have.string(telephone)

    }))
}

function getRequestAllClients(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)

        }))
    }))
}

function createClientRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload
        }).then((response =>{
            expect(JSON.stringify(response.body.name)).to.have.string(fakeClientPayload.name)
            expect(JSON.stringify(response.body.email)).to.have.string(fakeClientPayload.email)
            expect(JSON.stringify(response.body.telephone)).to.have.string(fakeClientPayload.telephone)

        }))

        getRequestAllClientsAssertion(cy, 
            fakeClientPayload.name, 
            fakeClientPayload.email, 
            fakeClientPayload.telephone)
    }))
}

function createClientRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeClientPayload = createRandomClientPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_CLIENT,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeClientPayload
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
        }))

        deleteRequestAfterGet(cy)
    }))
}

function deleteRequestAfterGet(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT + lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        })
        confirmDeleteAfterGet(cy, lastId)
    }))

}

function confirmDeleteAfterGet(cy, id){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_CLIENTS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        if(response.body.length >0){
            let lastId = response.body[response.body.length -1].id
            expect(lastId).to.eq(id-1)
        }
    }))
}

module.exports = {
    createClientRequest,
    getRequestAllClients,
    createClientRequestAndDelete,
    createRandomClientPayload,
    getRequestAllClientsAssertion
}