const service = require("./module.service");

// Create new module with institute configuration
exports.createModule = async (req, res) => {
  const data = await service.createModule(req.body);
  res.status(201).json({ success: true, data });
};

// Get modules for institution setup screen
exports.getModulesForInstitution = async (req, res) => {
  const { institutionId, instituteType } = req.query;
  const data = await service.getModulesForInstitution(
    institutionId,
    instituteType
  );
  res.json({ success: true, data });
};

// Assign or toggle module for institution
exports.assignModules = async (req, res) => {
  const data = await service.assignModules(req.body);
  res.json({ success: true, data });
};

// Get only enabled modules for runtime use
exports.getEnabledModules = async (req, res) => {
  const { institutionId } = req.query;
  const data = await service.getEnabledModules(institutionId);
  res.json({ success: true, data });
};

// Seed default modules for existing institution
exports.seedModulesForInstitution = async (req, res) => {
  const data = await service.seedModulesForInstitution(req.body);
  res.json({ success: true, data });
};

// Create permissions under a module
exports.createModulePermissions = async (req, res) => {
  const data = await service.createModulePermissions(req.body);
  res.status(201).json({ success: true, data });
};
