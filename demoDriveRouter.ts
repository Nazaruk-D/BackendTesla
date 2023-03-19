const RouterDemo = require('express')
const demoDriveRouter = new RouterDemo()
const demoDriveController = require('./demoDriveController')


const demoDriveEndPoints = {
    updateDemoDriveStatus: '/updateDemoDriveStatus',
    getDemoDriveOrders: '/getDemoDriveOrders',
}

demoDriveRouter.put(demoDriveEndPoints.updateDemoDriveStatus, demoDriveController.updateDemoDriveStatus);
demoDriveRouter.get(demoDriveEndPoints.getDemoDriveOrders, demoDriveController.getDemoDriveOrders);

module.exports = demoDriveRouter;