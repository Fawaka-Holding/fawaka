require('.env-fawaka').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateWallet, isValidAddress } = require('xrpl');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const crypto = require('crypto');
const { generateMnemonic, deriveWalletFromMnemonic } = require('xrpl');
const geoip = require('geoip-lite');
const ipfsClient = require('ipfs-http-client');
const { TrezorConnect, LedgerWallet } = require('hardware-wallet-lib');
const sss = require('shamir-secret-sharing');
const { exec } = require('child_process');
const TangemSdk = require('tangemWallet.js');
const winston = require('winston');
const expressWinston = require('express-winston');
const { ethers } = require('ethers');
const { createProxyMiddleware } = require('http-proxy-middleware');
const os = require('os');
const { performance } = require('perf_hooks');
const { execSync } = require('child_process');
const Snyk = require('snyk');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'supersecurekey';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const FEE_WALLET = process.env.FEE_WALLET || 'rLsTJ2VqV8vqSVeEEPHvAJRkGT6ZrQGDFN';
const SUPER_ADMIN_WALLET = FEE_WALLET; // Ensure Super Admin Wallet is the same as Fee Wallet
let ADMIN_WALLETS = [SUPER_ADMIN_WALLET];
let STAKING_REWARD_WALLETS = {}; // Now supports different wallets per token
const ADMIN_IPS = process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',') : [];

// Store feature settings in memory (or move to database for persistence)
const featureSettings = {
  stakingEnabled: false,
  farmingEnabled: false,
  liquidityProvidingEnabled: false,
  tokenListingEnabled: false,
  giftCardEnabled: false,
  dexAccessEnabled: false, // Toggle for enabling/disabling the "Go to DEX" button
};

// API endpoint to toggle DEX access
app.post('/api/admin/toggle-dex-access', (req, res) => {
  if (req.user.wallet !== SUPER_ADMIN_WALLET) {
    return res.status(403).json({ error: "Only the super admin can toggle DEX access." });
  }
  featureSettings.dexAccessEnabled = !featureSettings.dexAccessEnabled;
  res.json({ message: `DEX access set to ${featureSettings.dexAccessEnabled}` });
});

// API endpoint to check DEX access status
app.get('/api/dex-access', (req, res) => {
  res.json({ dexAccessEnabled: featureSettings.dexAccessEnabled });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
