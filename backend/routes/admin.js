const express = require("express");
const router = express.Router();

// Middleware to verify Super Admin
const verifySuperAdmin = (req, res, next) => {
  if (req.user.wallet !== SUPER_ADMIN_WALLET) {
    return res.status(403).json({ error: "Only the super admin can perform this action." });
  }
  next();
};

// Toggle Trezor Wallet Support
router.post("/toggle-trezor", verifySuperAdmin, (req, res) => {
  featureSettings.trezorEnabled = !featureSettings.trezorEnabled;
  res.json({ message: `Trezor support set to ${featureSettings.trezorEnabled}` });
});

// Toggle Ledger Wallet Support
router.post("/toggle-ledger", verifySuperAdmin, (req, res) => {
  featureSettings.ledgerEnabled = !featureSettings.ledgerEnabled;
  res.json({ message: `Ledger support set to ${featureSettings.ledgerEnabled}` });
});

// Get Current Wallet Support Status
router.get("/wallet-support", (req, res) => {
  res.json({
    trezorEnabled: featureSettings.trezorEnabled,
    ledgerEnabled: featureSettings.ledgerEnabled,
  });
});

module.exports = router;
