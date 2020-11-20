const faker = require('faker')

const ENDPOINT_GET_BILLS = 'http://localhost:3000/api/bills'
const ENDPOINT_POST_BILL = 'http://localhost:3000/api/bill/new'
const ENDPOINT_GET_BILL = 'http://localhost:3000/api/bill/'

function createRandomBillPayload(){
    const fakeBillValue = faker.random.number({min:1, max:200000})
    const fakePaid = faker.random.boolean()

    const payload = {
        "value":fakeBillValue,
        "paid":fakePaid
    }
    return payload
}

function getRequestAllBills(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_BILLS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)

        }))
    }))
}

function createBillRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeBillPayload = createRandomBillPayload()
        cy.request({
            method: "POST",
            url: ENDPOINT_POST_BILL,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeBillPayload
        }).then((response =>{
            expect(JSON.stringify(response.body.value)).to.have.string(fakeBillPayload.value)
            expect(JSON.stringify(response.body.paid)).to.have.string(fakeBillPayload.paid)
        }))

        getRequestAllBillsAssertion(cy, fakeBillPayload.value, fakeBillPayload.paid)
    }))
}

function getRequestAllBillsAssertion(cy, value, paid){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_BILLS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        expect(JSON.stringify(response.body[response.body.length -1].value)).to.have.string(value)
        expect(JSON.stringify(response.body[response.body.length -1].paid)).to.have.string(paid)
    }))
}

function createBillRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeBillPayload = createRandomBillPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_BILL,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeBillPayload
        }).then((response =>{
            expect(JSON.stringify(response.body.value)).to.have.string(fakeBillPayload.value)
            expect(JSON.stringify(response.body.paid)).to.have.string(fakeBillPayload.paid)
        }))

        getRequestAllBillsAssertion(cy, fakeBillPayload.value, fakeBillPayload.paid)
        deleteRequestAfterGet(cy)
    }))
}

function deleteRequestAfterGet(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_BILLS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_BILL + lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string('true')
        }))
        confirmDeleteAfterGet(cy, lastId)
    }))
}

function confirmDeleteAfterGet(cy, id){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_BILLS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        if(response.body.length >0){
            let lastId = response.body[response.body.length -1].id
            expect(lastId).to.not.eq(id)
        }
    }))
}

module.exports = {
    getRequestAllBills,
    createBillRequest,
    createBillRequestAndDelete,
    createRandomBillPayload,
    getRequestAllBillsAssertion
}