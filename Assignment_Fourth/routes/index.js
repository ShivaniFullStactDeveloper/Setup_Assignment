const express = require('express');
const router = express.Router();
// Import route modules
const institutionRoutes = require('../setup/institution/institution.routes');
const tosRoutes = require('../setup/tos/tos.routes')
const locationRoutes = require('../setup/location/location.routes')
const modulesRoutes = require('../setup/modules/module.routes')
const terminoloryRoutes = require('../setup/terminology/terminology.routes')

// Mount route modules
router.use('/institution', institutionRoutes);
router.use('/tos/', tosRoutes)
router.use('/location' , locationRoutes)
router.use('/modules' , modulesRoutes)
router.use('/terminology' , terminoloryRoutes)

module.exports = router;

