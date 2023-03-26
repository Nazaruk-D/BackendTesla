const RouterDemo = require('express')
const demoDriveRouter = new RouterDemo()
const demoDriveController = require('./demoDriveController')


const demoDriveEndPoints = {
    updateDemoDriveStatus: '/updateDemoDriveStatus',
    getDemoDriveOrders: '/getDemoDriveOrders',
    createDemoDriveOrder: '/createDemoDriveOrder',
}

demoDriveRouter.put(demoDriveEndPoints.updateDemoDriveStatus, demoDriveController.updateDemoDriveStatus);
demoDriveRouter.put(demoDriveEndPoints.createDemoDriveOrder, demoDriveController.createDemoDriveOrder);
demoDriveRouter.get(demoDriveEndPoints.getDemoDriveOrders, demoDriveController.getDemoDriveOrders);

module.exports = demoDriveRouter;