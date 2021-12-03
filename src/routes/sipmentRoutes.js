const express =  require("express");
const shipmentControllers = require('../Controllers/shipmentControllers');

const router = express.Router();
router.post("/createShipment" , shipmentControllers.createShipment);
router.get("/shipments" , shipmentControllers.getShipments);
router.get("/shipment/:id" , shipmentControllers.getShipmentById);
router.get("/shipmentByUserId/:id" , shipmentControllers.getShipmentByUser);
router.delete("/deleteShipment/:id" , shipmentControllers.deleteShipment);





module.exports = router;