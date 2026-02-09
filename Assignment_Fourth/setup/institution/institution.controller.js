const service = require("./institution.service");

// Setup institution 
exports.setupInstitution = async (req, res) => {
  // Call service to handle full institution setup logic
  const result = await service.setupInstitution(req.body);

  // Send success response after setup completion
  res.status(201).json({
    success: true,
    message: "Institution setup completed",
    data: result
  });
};

// Get institution basic data
exports.getInstitutionById = async (req, res) => {
  const data = await service.getInstitutionById(req.params.id);
  res.json({ success: true, data });
};

// Get tenant basic data
exports.getTenantById = async (req, res) => {
  const data = await service.getTenantById(req.params.id);
  res.json({ success: true, data });
};

// Get full institution profile
exports.getInstitutionProfile = async (req, res) => {
  const data = await service.getInstitutionProfile(req.params.id);
  res.json({ success: true, data });
};