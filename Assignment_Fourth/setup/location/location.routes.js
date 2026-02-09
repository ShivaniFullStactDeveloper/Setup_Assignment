const router = require("express").Router();
const controller = require("./location.controller");

router.post("/", controller.saveLocation);

module.exports = router;
