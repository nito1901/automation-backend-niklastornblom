import * as billHelpers from '../helpers/billHelpers'
import * as clientHelpers from '../helpers/clientHelpers'
import * as reservationHelpers from '../helpers/reservationHelpers'
import * as roomHelpers from '../helpers/roomHelpers'


describe('backend test suite', function(){
    it('TC01 - Login and logout', function(){
        cy.authenticateSession()
        cy.endSession()
    })

    it('TC02 - Create new room', function(){
        roomHelpers.createRoomRequest(cy)
    })

    it('TC03 - Create room and delete it', function(){
        roomHelpers.createRoomRequestAndDelete(cy)
    })

    it('TC04 - Create room and update it', function(){
        roomHelpers.createRoomRequestAndUpdate(cy)
    })

    it('TC05 - Create room, update and delete it', function(){
        roomHelpers.createRoomRequestUpdateAndDelete(cy)
    })

    it('TC06 - Create new bill', function(){
        billHelpers.createBillRequest(cy)
    })

    it('TC07 - Create new bill and delete it', function(){
        billHelpers.createBillRequestAndDelete(cy)
    })

    it('TC08 - Create a new reservation', function(){
        reservationHelpers.createReservationRequest(cy)
    })
})