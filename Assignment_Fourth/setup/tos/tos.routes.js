const router = require("express").Router();
const controller = require("./tos.controller");

// Create terms of service
router.post("/", controller.createTos);

// Get active terms of service
router.get("/active", controller.getActiveTos);

// Accept terms of service
router.post("/accept", controller.acceptTos);

module.exports = router;
