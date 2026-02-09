const router = require("express").Router();
const controller = require("./institution.controller");

router.post("/setup", controller.setupInstitution);

// Get institution by id
router.get("/:id", controller.getInstitutionById);

// Get tenant by id
router.get("/tenant/:id", controller.getTenantById);

// Get full institution profile
router.get("/profile/:id", controller.getInstitutionProfile);

module.exports = router;
