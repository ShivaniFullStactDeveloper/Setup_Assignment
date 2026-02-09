const service = require("./terminology.service");

// Create terminology group
exports.createGroup = async (req, res) => {
  const { group_key, display_name } = req.body;
  if (!group_key || !display_name) {
    return res.status(400).json({ success: false, message: "group_key & display_name required" });
  }
  const data = await service.createGroup(req.body);
  res.json({ success: true, data });
};

// Get all terminology groups
exports.getGroups = async (req, res) => {
  const data = await service.getGroups();
  res.json({ success: true, data });
};

// Create terminology term under group
exports.createTerm = async (req, res) => {
  const { group_id, term_key, default_label } = req.body;
  if (!group_id || !term_key || !default_label) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const data = await service.createTerm(req.body);
  res.json({ success: true, data });
};

// Get terms by group
exports.getTermsByGroup = async (req, res) => {
  const data = await service.getTermsByGroup(req.params.groupId);
  res.json({ success: true, data });
};

// Create institute-type terminology mapping
exports.createMapping = async (req, res) => {
  const { term_id, institute_type, language_code, display_label } = req.body;
  if (!term_id || !institute_type || !language_code || !display_label) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const data = await service.createMapping(req.body);
  res.json({ success: true, data });
};

// Resolve terminology for runtime use
exports.resolveTerminology = async (req, res) => {
  const { institutionId, instituteType, language } = req.query;
  if (!institutionId || !instituteType || !language) {
    return res.status(400).json({ success: false, message: "Missing params" });
  }
  const data = await service.resolveTerminology(req.query);
  res.json({ success: true, data });
};

// Update terminology group
exports.updateGroup = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "name required" });
  }
  const data = await service.updateGroup(req.params.id, name);
  res.json({ success: true, data });
};

// Delete terminology group
exports.deleteGroup = async (req, res) => {
  await service.deleteGroup(req.params.id);
  res.json({ success: true });
};

// Update terminology term
exports.updateTerm = async (req, res) => {
  const { default_label } = req.body;
  if (!default_label) {
    return res.status(400).json({ success: false, message: "label required" });
  }
  const data = await service.updateTerm(req.params.id, default_label);
  res.json({ success: true, data });
};

// Delete terminology term
exports.deleteTerm = async (req, res) => {
  await service.deleteTerm(req.params.id);
  res.json({ success: true });
};

// Update terminology mapping
exports.updateMapping = async (req, res) => {
  const { display_label } = req.body;
  if (!display_label) {
    return res.status(400).json({ success: false });
  }
  const data = await service.updateMapping(req.params.id, display_label);
  res.json({ success: true, data });
};

// Delete terminology mapping
exports.deleteMapping = async (req, res) => {
  await service.deleteMapping(req.params.id);
  res.json({ success: true });
};

// Delete institution-level terminology override
exports.deleteOverride = (client, id) => {
  return client.query(
    `DELETE FROM institution_terminology_overrides WHERE id = $1`,
    [id]
  );
};
