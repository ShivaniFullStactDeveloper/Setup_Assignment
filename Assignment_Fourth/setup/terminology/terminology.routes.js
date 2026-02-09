const router = require("express").Router();
const controller = require("./terminology.controller");

// Create and list terminology groups
router.post("/groups", controller.createGroup);
router.get("/groups", controller.getGroups);

// Create and list terms under group
router.post("/terms", controller.createTerm);
router.get("/terms/:groupId", controller.getTermsByGroup);

// Create institute-type terminology mapping
router.post("/mappings", controller.createMapping);

// Resolve terminology for runtime use
router.get("/resolve", controller.resolveTerminology);

// Update terminology entities
router.put("/groups/:id", controller.updateGroup);
router.put("/terms/:id", controller.updateTerm);
router.put("/mappings/:id", controller.updateMapping);

// Delete terminology entities
router.delete("/groups/:id", controller.deleteGroup);
router.delete("/terms/:id", controller.deleteTerm);
router.delete("/mappings/:id", controller.deleteMapping);

module.exports = router;
