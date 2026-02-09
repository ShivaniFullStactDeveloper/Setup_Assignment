const router = require("express").Router();
const controller = require("./module.controller");

// Create module with institute configuration
router.post("/create", controller.createModule);

// Get modules for institution setup (enabled + disabled)
router.get("/", controller.getModulesForInstitution);

// Enable or disable module for institution
router.post("/assign", controller.assignModules);

// Get only enable modules for institution
router.get("/enabled", controller.getEnabledModules);

// Create permissions under a module
router.post("/permissions", controller.createModulePermissions);

router.post("/seed", controller.createModulePermissions);




module.exports = router;
