const service = require("./location.service");

// Save institution location & regional settings
exports.saveLocation = async (req, res) => {
    const data = await service.saveLocation(req.body);
    res.status(200).json({
      success: true,
      message: "Location & regional settings saved",
      data
    });
};
