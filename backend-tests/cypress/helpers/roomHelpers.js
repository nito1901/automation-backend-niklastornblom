const faker = require('faker')

const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

function getRequestAllRooms(cy){
    cy.authenticateSession().then((response =>{
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response =>{
            const responseAsString = JSON.stringify(response)

        }))
    }))
}

function createRandomRoomPayload(){
    const fakeRoomNumber = faker.random.number({min:1, max:9999})
    const fakeFloorNumber = faker.random.number({min:0, max:60})
    const fakePrice = faker.random.number({min:300, max:25000})
    const fakeAvailable = faker.random.boolean()

    const featureSelections = ["balcony","ensuite","sea_view","penthouse"]
    const randomFeature = [featureSelections[faker.random.number({min:0, max:3})]]
    
    const categorySelections = ["single", "double","ensuite"]
    const randomCategory = categorySelections[faker.random.number({min:0, max:2})] 

    const payload = {
        "features":randomFeature,
        "category":randomCategory,
        "number":fakeRoomNumber,
        "floor":fakeFloorNumber,
        "available":fakeAvailable,
        "price":fakePrice
    }
    return payload
}

function createRandomRoomPutPayload(id){
    const fakeRoomNumber = faker.random.number({min:1, max:9999})
    const fakeFloorNumber = faker.random.number({min:0, max:60})
    const fakePrice = faker.random.number({min:300, max:25000})
    const fakeAvailable = faker.random.boolean()

    const featureSelections = ["balcony","ensuite","sea_view","penthouse"]
    const randomFeature = [featureSelections[faker.random.number({min:0, max:3})]]
    
    const categorySelections = ["single", "double","ensuite"]
    const randomCategory = categorySelections[faker.random.number({min:0, max:2})] 

    const payload = {
        "id":id,
        "features":randomFeature,
        "category":randomCategory,
        "number":fakeRoomNumber,
        "floor":fakeFloorNumber,
        "available":fakeAvailable,
        "price":fakePrice
    }
    return payload
}

function createRoomRequest(cy){
    cy.authenticateSession().then((response =>{
        let fakeRoomPayload = createRandomRoomPayload()

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

        getRequestAllRoomsAssertion(cy, 
            fakeRoomPayload.features,
            fakeRoomPayload.category,
            fakeRoomPayload.number,
            fakeRoomPayload.floor,
            fakeRoomPayload.available,
            fakeRoomPayload.price
            )
    }))
}

function getRequestAllRoomsAssertion(cy, features, category, number, floor, available, price){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        expect(JSON.stringify(response.body[response.body.length -1].number)).to.have.string(number)
        expect(JSON.stringify(response.body[response.body.length -1].features)).to.have.string(features)
        expect(JSON.stringify(response.body[response.body.length -1].category)).to.have.string(category)
        expect(JSON.stringify(response.body[response.body.length -1].floor)).to.have.string(floor)
        expect(JSON.stringify(response.body[response.body.length -1].available)).to.have.string(available)
        expect(JSON.stringify(response.body[response.body.length -1].price)).to.have.string(price)
    }))
}

function createRoomRequestAndDelete(cy){
    cy.authenticateSession().then((response =>{
        let fakeRoomPayload = createRandomRoomPayload()

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

        getRequestAllRoomsAssertion(cy, 
            fakeRoomPayload.features,
            fakeRoomPayload.category,
            fakeRoomPayload.number,
            fakeRoomPayload.floor,
            fakeRoomPayload.available,
            fakeRoomPayload.price
            )
            deleteRequestAfterGet(cy)
    }))
}

function deleteRequestAfterGet(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_ROOM + lastId,
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
        url: ENDPOINT_GET_ROOMS,
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

function createRoomRequestAndUpdate(cy){
    cy.authenticateSession().then((response =>{
        let fakeRoomPayload = createRandomRoomPayload()

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

        getRequestAllRoomsAssertion(cy, 
            fakeRoomPayload.features,
            fakeRoomPayload.category,
            fakeRoomPayload.number,
            fakeRoomPayload.floor,
            fakeRoomPayload.available,
            fakeRoomPayload.price
            )
            putRequestAfterGet(cy)
    }))
}

function putRequestAfterGet(cy){
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response =>{
        let lastId = response.body[response.body.length -1].id
        let fakeRoomPayload = createRandomRoomPutPayload(lastId)
        cy.request({
            method: "PUT",
            url: ENDPOINT_GET_ROOM + lastId,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body:fakeRoomPayload
        })
        getRequestAllRoomsAssertion(cy, 
            fakeRoomPayload.features,
            fakeRoomPayload.category,
            fakeRoomPayload.number,
            fakeRoomPayload.floor,
            fakeRoomPayload.available,
            fakeRoomPayload.price
            ) 
    }))
}

module.exports = {
    getRequestAllRooms,
    createRoomRequest,
    createRoomRequestAndDelete,
    createRoomRequestAndUpdate,
    createRoomRequestAndUpdate
}