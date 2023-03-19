const RouterDemo = require('express')
const demoDriveRouter = new RouterDemo()
const demoController = require('./demoController')


const demoDriveEndPoints = {
    updateDemoDriveStatus: '/updateDemoDriveStatus',
    demoDriveOrders: '/demoDriveOrders',
}

demoDriveRouter.put(demoDriveEndPoints.updateDemoDriveStatus, demoController.updateDemoDriveStatus)
demoDriveRouter.get(demoDriveEndPoints.demoDriveOrders, demoController.demoDriveOrders)

module.exports = RouterDemo