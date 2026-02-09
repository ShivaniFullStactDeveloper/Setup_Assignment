const service = require("./tos.service");

// Create terms of service
exports.createTos = async (req, res) => {
  const data = await service.createTos(req.body);
  res.status(201).json({ success: true, data });
};

// Get active terms of service
exports.getActiveTos = async (req, res) => {
  const data = await service.getActiveTos(req.query);
  res.json({ success: true, data });
};

// Accept terms of service
exports.acceptTos = async (req, res) => {
  await service.acceptTos(req.body);
  res.json({ success: true, message: "ToS accepted" });
};
