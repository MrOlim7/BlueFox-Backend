const express = require('express');
const router = express.Router();

let maintenanceMode = false; // Variable pour contrôler le mode maintenance

// Route pour récupérer l'état actuel
router.get('/status', (req, res) => {
  res.status(200).json({ status: maintenanceMode ? "maintenance" : "online" });
});

// Route pour activer/désactiver le mode maintenance
router.post('/toggle-maintenance', (req, res) => {
  maintenanceMode = !maintenanceMode; // Bascule entre les modes
  res.status(200).json({ status: maintenanceMode ? "maintenance" : "online" });
});

module.exports = router; // Exporte les routes
