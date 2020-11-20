const faker = require('faker')

import * as billHelpers from './billHelpers'
import * as clientHelpers from './clientHelpers'
import * as roomHelpers from './roomHelpers'

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_BILLS = 'http://localhost:3000/api/bills'
const ENDPOINT_POST_BILL = 'http://localhost:3000/api/bill/new'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'

const ENDPOINT_GET_RESERVATIONS = 'http://localhost:3000/api/reservations'
const ENDPOINT_POST_RESERVATION = 'http://localhost:3000/api/reservation/new'

function createRandomReservationPayload(){

    const numberOfClients = getRequestNumberOfClients(cy)
    const randomClient = faker.random.number({min:1, max:numberOfClients})

    const numberOfRooms = getRequestNumberOfRooms(cy)
    const randomRoom = faker.random.number({min:1, max:numberOfRooms})

    const numberOfBills = getRequestNumberOfBills(cy)
    const randomBill = faker.random.number({min:1, max:numberOfBills})
//
    let dateYear = faker.random.number({min: 2020, max: 2021})
    let dateMonth = faker.random.number({min: 1, max: 12})
    let dateDay = faker.random.number({min: 1, max: 28})

    if(dateMonth<10){
        dateMonth = '0' + dateMonth
    }
    if(dateDay<10){
        dateDay = '0' + dateDay
    }
    
    const randomStart = dateYear + '-' + dateMonth + '-' + dateDay
    const randomEnd = dateYear + '-' + dateMonth + '-' + dateDay

    const payload = {
        "client":randomClient,
        "room":randomRoom,
        "bill":randomBill,
        "start":randomStart,
        "end":randomEnd
    }
    return payload
}

function createReservationRequest(cy){
    cy.authenticateSession().then((response =>{
        createBillRequest(cy)
        createClientRequest(cy)
        createRoomRequest(cy)

        let fakeReservationPayload = createRandomReservationPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_RESERVATION,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeReservationPayload
        }).then((response =>{
            expect(JSON.stringify(response.body.client)).to.have.string(fakeReservationPayload.client)
            expect(JSON.stringify(response.body.room)).to.have.string(fakeReservationPayload.room)
            expect(JSON.stringify(response.body.bill)).to.have.string(fakeReservationPayload.bill)
            expect(JSON.stringify(response.body.start)).to.have.string(fakeReservationPayload.start)
            expect(JSON.stringify(response.body.end)).to.have.string(fakeReservationPayload.end)
           
        }))

        getRequestAllReservationsAssertion(cy, 
            fakeReservationPayload.client, 
            fakeReservationPayload.room,
            fakeReservationPayload.bill,
            fakeReservationPayload.start,
            fakeReservationPayload.end
            )  
    }))
}

function getRequestAllReservationsAssertion(cy, client, room, bill, start, end){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_RESERVATIONS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        expect(JSON.stringify(response.body[response.body.length -1].client)).to.have.string(client)
        expect(JSON.stringify(response.body[response.body.length -1].room)).to.have.string(room)
        expect(JSON.stringify(response.body[response.body.length -1].bill)).to.have.string(bill)
        expect(JSON.stringify(response.body[response.body.length -1].start)).to.have.string(start)
        expect(JSON.stringify(response.body[response.body.length -1].end)).to.have.string(end)
    }))
}

function getRequestNumberOfRooms(cy){
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            let numberOfRooms = response.body[response.body.length]
            return numberOfRooms
        }))
    
}

function getRequestNumberOfClients(cy){

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_CLIENTS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            let numberOfClients = response.body[response.body.length]
            return numberOfClients
        }))
    
}

function getRequestNumberOfBills(cy){

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_BILLS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)
            let numberOfBills = response.body[response.body.length]
            return numberOfBills

        }))
    
}

function createClientRequest(cy){

        let fakeClientPayload = clientHelpers.createRandomClientPayload()

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

        clientHelpers.getRequestAllClientsAssertion(cy, 
            fakeClientPayload.name, 
            fakeClientPayload.email, 
            fakeClientPayload.telephone)
    
}

function createBillRequest(cy){

        let fakeBillPayload = billHelpers.createRandomBillPayload()
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

        billHelpers.getRequestAllBillsAssertion(cy, fakeBillPayload.value, fakeBillPayload.paid)
    
}

function createRoomRequest(cy){

        let fakeRoomPayload = roomHelpers.createRandomRoomPayload()

        cy.request({
            method: "POST",
            url: ENDPOINT_POST_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeRoomPayload
        }).then((response =>{
            expect(JSON.stringify(response.body.number)).to.have.string(fakeRoomPayload.number)
            expect(JSON.stringify(response.body.features)).to.have.string(fakeRoomPayload.features)
            expect(JSON.stringify(response.body.category)).to.have.string(fakeRoomPayload.category)
            expect(JSON.stringify(response.body.floor)).to.have.string(fakeRoomPayload.floor)
            expect(JSON.stringify(response.body.available)).to.have.string(fakeRoomPayload.available)
            expect(JSON.stringify(response.body.price)).to.have.string(fakeRoomPayload.price)
        }))

        roomHelpers.getRequestAllRoomsAssertion(cy, 
            fakeRoomPayload.features,
            fakeRoomPayload.category,
            fakeRoomPayload.number,
            fakeRoomPayload.floor,
            fakeRoomPayload.available,
            fakeRoomPayload.price
            )
    
}

module.exports = {
    createReservationRequest
}